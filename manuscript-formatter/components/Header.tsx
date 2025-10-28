'use client';

import { Button } from '@/components/ui/button';
import { Home, FileText } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Manuscript Formatter
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Format for Kindle Publishing
            </p>
          </div>
        </div>

        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Start Over</span>
          </Button>
        )}
      </div>
    </header>
  );
}
