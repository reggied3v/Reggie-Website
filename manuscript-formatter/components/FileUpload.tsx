'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProcessingStatus } from '@/types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  status: ProcessingStatus;
}

export default function FileUpload({ onFileSelect, status }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    setError('');

    // Check file type
    if (!file.name.endsWith('.docx')) {
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'unknown';
      setError(`Only .docx files are supported. You uploaded a .${fileExtension} file. Please convert your document to Microsoft Word (.docx) format and try again.`);
      return false;
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File exceeds 10MB limit. Your file is ${fileSizeMB} MB. Please use a smaller file or compress your document.`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isDisabled = status === 'uploading' || status === 'processing';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={`
          relative border-2 border-dashed transition-all
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        `}
      >
        <CardContent className="p-12">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileInput}
            disabled={isDisabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            id="file-upload"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="space-y-4 text-center"
          >
            <div className="flex justify-center">
              <div className={`
                p-4 rounded-full transition-colors
                ${isDragging ? 'bg-primary/10' : 'bg-muted'}
              `}>
                <Upload className={`
                  w-12 h-12 transition-colors
                  ${isDragging ? 'text-primary' : 'text-muted-foreground'}
                `} />
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-foreground">
                Drop your manuscript here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="gap-1 cursor-help">
                    <FileText className="w-3 h-3" />
                    .docx only
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Only Microsoft Word (.docx) files are supported. Save your document as .docx format before uploading.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="cursor-help">
                    Max 10MB
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Files larger than 10MB cannot be processed. Most manuscripts under 250,000 words should fit within this limit.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-4 border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/90 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
