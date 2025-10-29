'use client';

import { useState } from 'react';
import { FormatPreset, FormatOptions, FORMAT_PRESETS } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface FormatSelectorProps {
  onFormatChange: (options: FormatOptions) => void;
  initialPreset?: FormatPreset;
}

export default function FormatSelector({ onFormatChange, initialPreset = 'ebook' }: FormatSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<FormatPreset>(initialPreset);
  const [customOptions, setCustomOptions] = useState<Partial<FormatOptions>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Merge preset with custom options
  const getCurrentOptions = (): FormatOptions => {
    return {
      ...(FORMAT_PRESETS[selectedPreset] as FormatOptions),
      ...customOptions,
      preset: selectedPreset,
    };
  };

  const handlePresetChange = (preset: FormatPreset) => {
    setSelectedPreset(preset);
    setCustomOptions({}); // Reset custom options when changing preset
    onFormatChange({
      ...(FORMAT_PRESETS[preset] as FormatOptions),
      preset,
    });
  };

  const handleCustomOptionChange = (key: keyof FormatOptions, value: any) => {
    const newOptions = {
      ...customOptions,
      [key]: value,
    };
    setCustomOptions(newOptions);
    // Merge preset with new custom options (not old state)
    onFormatChange({
      ...(FORMAT_PRESETS[selectedPreset] as FormatOptions),
      ...newOptions,
      preset: selectedPreset,
    });
  };

  const presetInfo = {
    ebook: {
      icon: '📖',
      title: 'eBook (Kindle/ePub)',
      description: 'Optimized for digital reading on Kindle, Apple Books, and other e-readers.',
      features: [
        'Georgia 12pt font (highly readable on screens)',
        '0.5" first-line indents (fiction style)',
        'Single spacing',
        'Curly quotes and proper typography',
        'Clickable table of contents',
      ],
      guidelines: {
        text: 'Amazon Kindle Publishing Guidelines',
        url: 'https://kdp.amazon.com/en_US/help/topic/G200645680',
      },
    },
    'print': {
      icon: '📚',
      title: 'Print Book',
      description: 'Professional formatting for print-on-demand paperback and hardcover books. Interior formatting is identical for both.',
      features: [
        'Garamond 10pt font (professional print standard)',
        'Dynamic margins based on page count (KDP guidelines)',
        'Justified text alignment',
        '6" x 9" trim size (standard)',
        'Headers with author name and book title',
        'Page numbers',
      ],
      guidelines: {
        text: 'KDP Print Formatting Guidelines',
        url: 'https://kdp.amazon.com/en_US/help/topic/G201834180',
      },
    },
    'manuscript-submission': {
      icon: '📄',
      title: 'Manuscript Submission',
      description: 'Standard format for submitting to agents, publishers, and editors.',
      features: [
        'Times New Roman 12pt font (industry submission standard)',
        'Double-spaced for editing',
        '1" margins all around',
        'Header with author/title on every page',
        'Simple formatting (no curly quotes)',
      ],
      guidelines: {
        text: 'Standard Manuscript Format',
        url: 'https://www.shunn.net/format/novel/',
      },
    },
  };

  const currentPresetInfo = presetInfo[selectedPreset];
  const currentOptions = getCurrentOptions();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Preset Selection */}
      <div>
        <RadioGroup value={selectedPreset} onValueChange={handlePresetChange}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(presetInfo).map(([key, info]) => (
              <div
                key={key}
                className={`relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedPreset === key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handlePresetChange(key as FormatPreset)}
              >
                <RadioGroupItem value={key} id={key} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={key}
                        className="text-base font-medium cursor-pointer block break-words"
                      >
                        {info.title}
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 break-words">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Preset Details */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold text-lg mb-3">{currentPresetInfo.title} Features</h3>
        <ul className="space-y-2 mb-4">
          {currentPresetInfo.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0"
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
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <a
          href={currentPresetInfo.guidelines.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          {currentPresetInfo.guidelines.text}
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
        >
          <span className="font-medium">Advanced Formatting Options</span>
          <svg
            className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-6 bg-card rounded-lg border space-y-6">
            {/* Fiction vs Non-Fiction Guidance */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-sm">📚 Fiction vs. Non-Fiction Guidance</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Fiction:</strong> Traditional first-line indents (0.5"), no space between paragraphs
                </p>
                <p>
                  <strong>Non-Fiction:</strong> Block paragraphs (no indent), space between paragraphs
                </p>
              </div>
            </div>

            {/* Paragraph Indentation */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Paragraph Style</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indent-enabled"
                  checked={currentOptions.indent?.enabled ?? true}
                  onCheckedChange={(checked) =>
                    handleCustomOptionChange('indent', {
                      ...currentOptions.indent,
                      enabled: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="indent-enabled" className="text-sm cursor-pointer">
                  Enable first-line indents (fiction style)
                </Label>
              </div>
              {currentOptions.indent?.enabled && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="indent-size" className="text-sm">
                    Indent size (inches)
                  </Label>
                  <Input
                    id="indent-size"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={currentOptions.indent?.size ?? 0.5}
                    onChange={(e) =>
                      handleCustomOptionChange('indent', {
                        ...currentOptions.indent,
                        size: parseFloat(e.target.value),
                      })
                    }
                    className="w-32"
                  />
                </div>
              )}
            </div>

            {/* Line Spacing */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Line Spacing</Label>
              <RadioGroup
                value={currentOptions.spacing?.lineHeight ?? 'single'}
                onValueChange={(value) =>
                  handleCustomOptionChange('spacing', {
                    ...currentOptions.spacing,
                    lineHeight: value,
                  })
                }
              >
                <div className="space-y-2">
                  {['single', '1.15', '1.5', 'double'].map((spacing) => (
                    <div key={spacing} className="flex items-center space-x-2">
                      <RadioGroupItem value={spacing} id={`spacing-${spacing}`} />
                      <Label htmlFor={`spacing-${spacing}`} className="text-sm cursor-pointer capitalize">
                        {spacing === '1.15' ? '1.15 (Default eBook)' : spacing}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Typography Options */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Typography Fixes</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="curly-quotes"
                    checked={currentOptions.typography?.curlyQuotes ?? true}
                    onCheckedChange={(checked) =>
                      handleCustomOptionChange('typography', {
                        ...currentOptions.typography,
                        curlyQuotes: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="curly-quotes" className="text-sm cursor-pointer">
                    Convert to curly quotes (" → ")
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="em-dashes"
                    checked={currentOptions.typography?.emDashes ?? true}
                    onCheckedChange={(checked) =>
                      handleCustomOptionChange('typography', {
                        ...currentOptions.typography,
                        emDashes: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="em-dashes" className="text-sm cursor-pointer">
                    Convert to em-dashes (-- → —)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ellipsis"
                    checked={currentOptions.typography?.ellipsis ?? true}
                    onCheckedChange={(checked) =>
                      handleCustomOptionChange('typography', {
                        ...currentOptions.typography,
                        ellipsis: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="ellipsis" className="text-sm cursor-pointer">
                    Convert to ellipsis (... → …)
                  </Label>
                </div>
              </div>
            </div>

            {/* Chapter Heading Customization */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Chapter Heading Style</Label>
              <div className="ml-0 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="chapter-heading-size" className="text-sm">
                    Heading font size (points)
                  </Label>
                  <Input
                    id="chapter-heading-size"
                    type="number"
                    min="12"
                    max="36"
                    value={currentOptions.font?.chapterHeadingSize ?? 18}
                    onChange={(e) =>
                      handleCustomOptionChange('font', {
                        ...currentOptions.font,
                        chapterHeadingSize: parseInt(e.target.value),
                      })
                    }
                    className="w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-top-margin" className="text-sm">
                    Space above heading (inches)
                  </Label>
                  <Input
                    id="chapter-top-margin"
                    type="number"
                    step="0.25"
                    min="0"
                    max="4"
                    value={currentOptions.font?.chapterHeadingTopMargin ?? 0}
                    onChange={(e) =>
                      handleCustomOptionChange('font', {
                        ...currentOptions.font,
                        chapterHeadingTopMargin: parseFloat(e.target.value),
                      })
                    }
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Increase to start chapters lower on the page (e.g., 1.5-2.5 inches for traditional print books)
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-toc"
                checked={currentOptions.generateTOC ?? true}
                onCheckedChange={(checked) =>
                  handleCustomOptionChange('generateTOC', checked as boolean)
                }
              />
              <Label htmlFor="generate-toc" className="text-sm cursor-pointer">
                Generate Table of Contents
              </Label>
            </div>

            {/* Print-specific options */}
            {selectedPreset === 'print' && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Print-Specific Options</h4>

                {/* Author Name and Book Title */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="author-name" className="text-sm">
                      Author Name (for headers)
                    </Label>
                    <Input
                      id="author-name"
                      type="text"
                      placeholder="Your Name"
                      value={currentOptions.authorName ?? ''}
                      onChange={(e) => handleCustomOptionChange('authorName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="book-title" className="text-sm">
                      Book Title (for headers)
                    </Label>
                    <Input
                      id="book-title"
                      type="text"
                      placeholder="Your Book Title"
                      value={currentOptions.bookTitle ?? ''}
                      onChange={(e) => handleCustomOptionChange('bookTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
