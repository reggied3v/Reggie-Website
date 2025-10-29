'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import DownloadSection from '@/components/DownloadSection';
import FeedbackForm from '@/components/FeedbackForm';
import FAQ from '@/components/FAQ';
import FormatSelector from '@/components/FormatSelector';
import PreviewPane from '@/components/PreviewPane';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProcessingStatus, FeedbackForm as FeedbackFormType, FormatOptions, FORMAT_PRESETS } from '@/types';
import { generatePreview } from '@/lib/preview-generator';

export default function Home() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<Buffer | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [processedFile, setProcessedFile] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string>('');
  const [formatOptions, setFormatOptions] = useState<FormatOptions>(FORMAT_PRESETS['ebook'] as FormatOptions);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Generate preview when file is selected or format options change
  useEffect(() => {
    if (fileBuffer && selectedFile) {
      const generatePreviewAsync = async () => {
        setIsGeneratingPreview(true);
        try {
          const previewData = await generatePreview(fileBuffer, formatOptions);
          setPreviewHtml(previewData.html);
        } catch (error) {
          console.error('Preview generation error:', error);
          setError('Failed to generate preview. The file may be corrupted.');
        } finally {
          setIsGeneratingPreview(false);
        }
      };
      generatePreviewAsync();
    }
  }, [fileBuffer, formatOptions, selectedFile]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError('');
    setPreviewHtml('');

    try {
      // Read file as buffer for preview
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      setFileBuffer(buffer);
    } catch (err) {
      console.error('File read error:', err);
      setError('Failed to read file. Please try again.');
    }
  };

  const handleProcessAndDownload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('formatOptions', JSON.stringify(formatOptions));

      setStatus('processing');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Processing failed');
      }

      // Get the processed file as a blob
      const blob = await response.blob();
      const fileName = `formatted-${selectedFile.name}`;

      setProcessedFile({ blob, fileName });
      setStatus('complete');

    } catch (err) {
      console.error('Upload error:', err);

      // Better error messages
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Connection lost. Please check your internet connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Processing took too long. Your file might be too large or complex. Please try a smaller file.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setSelectedFile(null);
    setFileBuffer(null);
    setPreviewHtml('');
    setProcessedFile(null);
    setShowFeedback(false);
    setError('');
  };

  const handleFeedbackSubmit = async (feedback: FeedbackFormType) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        console.error('Failed to submit feedback');
      }

      // Success - the FeedbackForm component will show the thank you message
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Don't show error to user - just log it
    }
  };

  const handleFeedbackSkip = () => {
    // Reset to home page after feedback is skipped or submitted
    handleReset();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header with Home Button */}
        <Header onReset={handleReset} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Only show on initial landing */}
        {!selectedFile && !processedFile && status === 'idle' && (
          <section className="py-16 md:py-24 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Professional Manuscript Formatting in Minutes
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Format your manuscript for Kindle, print publishing, or agent submission
              </p>

              {/* Value Props */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center space-x-2 text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Industry-standard formatting</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Live preview</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete privacy</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  const formatSection = document.getElementById('format-selector');
                  formatSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Social Proof */}
              <p className="mt-8 text-sm text-muted-foreground">
                Free • No signup required • Files never stored
              </p>
            </div>
          </section>
        )}

        {/* Divider */}
        {!selectedFile && !processedFile && status === 'idle' && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="h-px bg-border"></div>
          </div>
        )}

        {/* Show feedback form if requested */}
        {showFeedback ? (
          <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            onSkip={handleFeedbackSkip}
          />
        ) : (
          <>
            {/* Show upload interface when idle or error */}
            {(status === 'idle' || status === 'error') && !selectedFile && (
              <div className="space-y-8 py-12">
                {/* Format Selector Section */}
                <div id="format-selector" className="scroll-mt-24">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                      Choose Your Format
                    </h2>
                    <p className="text-muted-foreground">
                      Select the format that matches your publishing goals
                    </p>
                  </div>
                  <FormatSelector
                    onFormatChange={setFormatOptions}
                    initialPreset="ebook"
                  />
                </div>

                {/* File Upload */}
                <div className="border-t pt-8">
                  <h2 className="text-xl font-semibold text-foreground text-center mb-6">
                    Upload Your Manuscript
                  </h2>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    status={status}
                  />
                </div>

                {error && (
                  <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <button
                          onClick={handleReset}
                          className="text-sm text-red-600 underline mt-2"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Section */}
                <div className="max-w-2xl mx-auto mt-12">
                  <h2 className="text-xl font-semibold text-foreground text-center mb-6">
                    What we do
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm border hover:border-primary/50 transition-colors">
                      <h3 className="font-medium mb-2 text-base">
                        Chapter Detection
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Recognizes patterns like "Chapter 1", "Chapter One", "Prologue", and "Epilogue". Adds proper page breaks before each chapter.
                      </p>
                    </div>

                    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm border hover:border-primary/50 transition-colors">
                      <h3 className="font-medium mb-2 text-base">
                        Typography Fixes
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Converts straight quotes ("") to curly quotes (""), double hyphens (--) to em-dashes (—), and triple dots (...) to ellipsis (…).
                      </p>
                    </div>

                    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm border hover:border-primary/50 transition-colors">
                      <h3 className="font-medium mb-2 text-base">
                        Professional Formatting
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Adds 0.5 inch first-line indents to paragraphs (except the first paragraph after chapter headings) and proper spacing between paragraphs.
                      </p>
                    </div>

                    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm border hover:border-primary/50 transition-colors">
                      <h3 className="font-medium mb-2 text-base">
                        Table of Contents
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Creates a clickable table of contents at the beginning of your document with hyperlinks that jump to each chapter.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                  <FAQ />
                </div>
              </div>
            )}

            {/* Show preview and format selector when file is selected */}
            {selectedFile && status === 'idle' && (
              <div className="space-y-6">
                {/* Header with file info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Format Your Manuscript
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      File: {selectedFile.name}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Change File
                  </button>
                </div>

                {/* Two-column layout: Format Selector + Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Format Selector */}
                  <div className="space-y-6">
                    <FormatSelector
                      onFormatChange={setFormatOptions}
                      initialPreset="ebook"
                    />
                  </div>

                  {/* Right: Preview */}
                  <div className="lg:sticky lg:top-4 h-[600px]">
                    {isGeneratingPreview ? (
                      <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg border">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-sm text-muted-foreground">Generating preview...</p>
                        </div>
                      </div>
                    ) : previewHtml ? (
                      <PreviewPane
                        htmlContent={previewHtml}
                        formatOptions={formatOptions}
                        fileName={selectedFile.name}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Process & Download Button */}
                <div className="flex justify-center pt-6 border-t">
                  <button
                    onClick={handleProcessAndDownload}
                    disabled={isGeneratingPreview}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Process & Download
                  </button>
                </div>
              </div>
            )}

            {/* Show processing indicator */}
            {(status === 'uploading' || status === 'processing') && (
              <ProcessingIndicator
                status={status}
                fileName={selectedFile?.name}
              />
            )}

            {/* Show download section */}
            {status === 'complete' && processedFile && (
              <DownloadSection
                fileName={processedFile.fileName}
                fileBlob={processedFile.blob}
                onReset={handleReset}
                onShowFeedback={() => setShowFeedback(true)}
              />
            )}
          </>
        )}
      </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>Manuscript Formatter v1.0 MVP - Format your manuscripts for Kindle</p>
          <p className="mt-1">Anonymous usage - No files are stored on our servers</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}
