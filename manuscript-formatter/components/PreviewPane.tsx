'use client';

import { useEffect, useState, useRef } from 'react';
import { FormatOptions } from '@/types';
import { generatePreviewStyles } from '@/lib/preview-generator';

interface PreviewPaneProps {
  htmlContent: string;
  formatOptions: FormatOptions;
  fileName?: string;
  isLoading?: boolean;
}

export default function PreviewPane({ htmlContent, formatOptions, fileName, isLoading = false }: PreviewPaneProps) {
  const [zoom, setZoom] = useState(100);
  const [fitToPageZoom, setFitToPageZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll');
  const [currentPage, setCurrentPage] = useState(0);
  const [styles, setStyles] = useState(() => generatePreviewStyles(formatOptions));
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Split content into pages based on page breaks
  const pages = htmlContent.split('<div class="page-break"></div>').filter(page => page.trim());

  // Update styles whenever formatOptions change
  useEffect(() => {
    setStyles(generatePreviewStyles(formatOptions));
  }, [formatOptions]);

  // Calculate zoom to fit page width to container
  useEffect(() => {
    const calculateFitZoom = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      // Account for padding (p-8 = 2rem = 32px on each side)
      const availableWidth = containerWidth - 64;

      // Get page width in inches
      const pageWidthInches = formatOptions.trimSize
        ? formatOptions.trimSize.width
        : 8.5;

      // Convert inches to pixels (96 DPI standard)
      const pageWidthPixels = pageWidthInches * 96;

      // Calculate zoom percentage to fit
      const calculatedZoom = Math.floor((availableWidth / pageWidthPixels) * 100);

      // Clamp between 50% and 150%
      const clampedZoom = Math.max(50, Math.min(150, calculatedZoom));

      setFitToPageZoom(clampedZoom);
      setZoom(clampedZoom);
    };

    calculateFitZoom();

    // Recalculate on window resize
    window.addEventListener('resize', calculateFitZoom);
    return () => window.removeEventListener('resize', calculateFitZoom);
  }, [formatOptions.trimSize]);

  // Scroll to top when view mode changes or page changes (preserve horizontal center)
  useEffect(() => {
    if (containerRef.current) {
      // Only scroll vertically to top, keep horizontal position (mx-auto handles centering)
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [viewMode, currentPage]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(fitToPageZoom);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => prev === 'scroll' ? 'page' : 'scroll');
    setCurrentPage(0); // Reset to first page when switching modes
  };

  // Handle TOC link clicks in Pages view
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'page') return;

    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href.includes('#chapter-')) {
      e.preventDefault();

      // Extract chapter index from the link
      const chapterMatch = link.href.match(/#chapter-(\d+)/);
      if (chapterMatch) {
        const chapterIndex = parseInt(chapterMatch[1], 10);

        // Find which page contains this chapter
        for (let i = 0; i < pages.length; i++) {
          if (pages[i].includes(`data-chapter-index="${chapterIndex}"`)) {
            setCurrentPage(i);
            break;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-muted/30 rounded-lg border relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Updating preview...</p>
          </div>
        </div>
      )}

      {/* Preview Header */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b bg-card">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <h3 className="font-medium text-foreground">Preview</h3>
          {fileName && (
            <span className="text-sm text-muted-foreground hidden lg:inline">— {fileName}</span>
          )}
        </div>

        {/* View Mode Toggle & Page Navigation */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded">
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1 text-xs font-medium rounded-l transition-colors ${
                viewMode === 'scroll'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
              title="Continuous scroll view"
            >
              Scroll
            </button>
            <button
              onClick={() => setViewMode('page')}
              className={`px-3 py-1 text-xs font-medium rounded-r transition-colors ${
                viewMode === 'page'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
              title="Page-by-page view"
            >
              Pages
            </button>
          </div>

          {/* Page Navigation (only in page mode) */}
          {viewMode === 'page' && pages.length > 1 && (
            <div className="flex items-center space-x-2 border-l pl-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                Page {currentPage + 1} of {pages.length}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 border-l pl-3 ml-auto flex-shrink-0">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-2 text-sm rounded border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 150}
            className="p-2 text-sm rounded border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1 text-xs rounded border hover:bg-muted hidden sm:block"
            title="Reset zoom"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div ref={containerRef} className="flex-1 overflow-auto p-8 bg-gray-100">
        <div
          ref={contentRef}
          className="preview-page bg-white shadow-lg mx-auto"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            width: formatOptions.trimSize
              ? `${formatOptions.trimSize.width}in`
              : '8.5in',
            minHeight: formatOptions.trimSize
              ? `${formatOptions.trimSize.height}in`
              : '11in',
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <div
            className="preview-content"
            onClick={handleContentClick}
            dangerouslySetInnerHTML={{
              __html: viewMode === 'scroll'
                ? htmlContent
                : pages[currentPage] || htmlContent
            }}
          />
        </div>
      </div>

      {/* Preview Footer */}
      <div className="px-4 py-2 border-t bg-card text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            Format: {formatOptions.preset.charAt(0).toUpperCase() + formatOptions.preset.slice(1).replace('-', ' ')}
          </span>
          {formatOptions.trimSize && (
            <span>
              {formatOptions.trimSize.width}" × {formatOptions.trimSize.height}"
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
