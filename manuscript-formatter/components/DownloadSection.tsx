'use client';

import { CheckCircle2, Download, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DownloadSectionProps {
  fileName: string;
  fileBlob: Blob;
  onReset: () => void;
  onShowFeedback: () => void;
}

export default function DownloadSection({
  fileName,
  fileBlob,
  onReset,
  onShowFeedback
}: DownloadSectionProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show feedback form after download
    setTimeout(() => {
      onShowFeedback();
    }, 500);
  };

  const formattingSteps = [
    'Detected and formatted chapter headings',
    'Added page breaks before chapters',
    'Fixed typography (quotes, dashes, ellipsis)',
    'Applied professional paragraph formatting',
    'Generated Table of Contents'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Your manuscript is ready!
              </h2>
              <p className="text-muted-foreground mt-2">
                We've formatted your document for Kindle publishing
              </p>
            </div>

            {/* What was done */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What we did:</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-2 text-sm">
                  {formattingSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How to Test */}
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
                  <CheckCircle2 className="w-5 h-5" />
                  How to test your Kindle formatting
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-2">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Preview how your manuscript will look on Kindle devices:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                  asChild
                >
                  <a
                    href="https://www.amazon.com/Kindle-Previewer/b?node=21381691011"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Download Kindle Previewer (Free)
                  </a>
                </Button>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Opens your .docx file and shows exactly how it will appear on Kindle, Fire, iPad, and iPhone
                </p>
              </CardContent>
            </Card>

            {/* File name */}
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {fileName}
              </Badge>
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              size="lg"
              className="w-full gap-2 text-lg h-14"
            >
              <Download className="w-5 h-5" />
              Download Formatted Manuscript
            </Button>

            {/* Process Another File */}
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              Format another manuscript
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
