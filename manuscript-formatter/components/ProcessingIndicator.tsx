'use client';

import { ProcessingStatus } from '@/types';

interface ProcessingIndicatorProps {
  status: ProcessingStatus;
  fileName?: string;
}

export default function ProcessingIndicator({ status, fileName }: ProcessingIndicatorProps) {
  if (status === 'idle') return null;

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading your manuscript...';
      case 'processing':
        return 'Formatting your document...';
      case 'complete':
        return 'Processing complete!';
      case 'error':
        return 'An error occurred';
      default:
        return '';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'uploading':
        return 'Please wait while we upload your file';
      case 'processing':
        return 'Detecting chapters, fixing typography, and generating Table of Contents';
      case 'complete':
        return 'Your Kindle-ready manuscript is ready to download';
      case 'error':
        return 'Something went wrong. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          {(status === 'uploading' || status === 'processing') && (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}

          {/* Success Icon */}
          {status === 'complete' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {/* Error Icon */}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}

          {/* Status Message */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {getStatusMessage()}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {getStatusDescription()}
            </p>
            {fileName && status !== 'error' && (
              <p className="text-xs text-gray-500 mt-2">
                {fileName}
              </p>
            )}
          </div>

          {/* Progress Steps (for processing state) */}
          {status === 'processing' && (
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Detecting chapters</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fixing typography</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Formatting paragraphs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Generating Table of Contents</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
