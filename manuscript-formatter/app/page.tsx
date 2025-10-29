'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import DownloadSection from '@/components/DownloadSection';
import FeedbackForm from '@/components/FeedbackForm';
import FAQ from '@/components/FAQ';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProcessingStatus, FeedbackForm as FeedbackFormType } from '@/types';

export default function Home() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError('');
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

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
      const fileName = `formatted-${file.name}`;

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
    setShowFeedback(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header with Home Button */}
        <Header onReset={handleReset} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show feedback form if requested */}
        {showFeedback ? (
          <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            onSkip={handleFeedbackSkip}
          />
        ) : (
          <>
            {/* Show upload interface when idle or error */}
            {(status === 'idle' || status === 'error') && (
              <div className="space-y-6">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  status={status}
                />

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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border cursor-help hover:border-primary/50 transition-colors">
                          <h3 className="font-medium mb-2">
                            Chapter Detection
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Automatically detects chapters, prologues, and epilogues
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Recognizes patterns like "Chapter 1", "Chapter One", "Prologue", and "Epilogue". Adds proper page breaks before each chapter.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border cursor-help hover:border-primary/50 transition-colors">
                          <h3 className="font-medium mb-2">
                            Typography Fixes
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Converts quotes, dashes, and ellipsis to proper formats
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Converts straight quotes ("") to curly quotes (""), double hyphens (--) to em-dashes (—), and triple dots (...) to ellipsis (…).</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border cursor-help hover:border-primary/50 transition-colors">
                          <h3 className="font-medium mb-2">
                            Professional Formatting
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Applies industry-standard paragraph spacing and indents
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Adds 0.5 inch first-line indents to paragraphs (except the first paragraph after chapter headings) and proper spacing between paragraphs.</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border cursor-help hover:border-primary/50 transition-colors">
                          <h3 className="font-medium mb-2">
                            Table of Contents
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Generates a clickable TOC from your chapters
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Creates a clickable table of contents at the beginning of your document with hyperlinks that jump to each chapter.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                  <FAQ />
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
