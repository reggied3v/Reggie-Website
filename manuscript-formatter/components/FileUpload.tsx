'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      setError('Please upload a .docx file only');
      return false;
    }

    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be under 5MB');
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
              <Badge variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" />
                .docx only
              </Badge>
              <Badge variant="secondary">
                Max 5MB
              </Badge>
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
