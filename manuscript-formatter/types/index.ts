// Types for Manuscript Formatter

export interface Chapter {
  title: string;
  heading: string;
  startIndex: number;
  type: 'chapter' | 'prologue' | 'epilogue' | 'front-matter';
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

export interface DocumentMetadata {
  totalParagraphs: number;
  chaptersDetected: number;
  chapters: Chapter[];
  hasFrontMatter: boolean;
}

export interface FeedbackForm {
  wasHelpful: boolean;
  easyToUse: boolean;
  formattingAccurate: boolean;
  wouldRecommend: boolean;
  additionalComments?: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

// Format Options Types
export type FormatPreset = 'ebook' | 'print' | 'manuscript-submission';

export interface HeaderFooterConfig {
  enabled: boolean;
  oddPageHeader?: string; // e.g., "Book Title"
  evenPageHeader?: string; // e.g., "Author Name"
  oddPageFooter?: string;
  evenPageFooter?: string;
  removeOnChapterPages?: boolean;
  position?: 'inside' | 'outside' | 'center';
}

export interface PageNumberConfig {
  enabled: boolean;
  style: 'arabic' | 'roman' | 'Roman'; // 1,2,3 or i,ii,iii or I,II,III
  position: 'top-inside' | 'top-outside' | 'top-center' | 'bottom-inside' | 'bottom-outside' | 'bottom-center';
  startAt: number;
  frontMatterStyle?: 'roman' | 'Roman' | 'none'; // Different style for front matter
}

export interface MarginConfig {
  top: number; // in inches
  bottom: number;
  inside: number; // gutter margin
  outside: number;
  calculateByPageCount?: boolean; // For print books
}

export interface TypographyConfig {
  curlyQuotes: boolean;
  emDashes: boolean;
  ellipsis: boolean;
}

export interface IndentConfig {
  enabled: boolean;
  size: number; // in inches
  skipFirstParagraph?: boolean; // Skip indent on first paragraph after headings
  useBlockParagraphs?: boolean; // Space between instead of indent
}

export interface SpacingConfig {
  lineHeight: 'single' | '1.15' | '1.5' | 'double';
  beforeParagraph: number; // in points
  afterParagraph: number;
}

export interface FontConfig {
  family: string;
  size: number; // in points
  chapterHeadingSize?: number;
  chapterHeadingTopMargin?: number; // in inches - space above chapter heading
}

export interface FormatOptions {
  preset: FormatPreset;

  // Core formatting
  margins: MarginConfig;
  indent: IndentConfig;
  spacing: SpacingConfig;
  font: FontConfig;
  typography: TypographyConfig;

  // Print-specific options
  headers?: HeaderFooterConfig;
  pageNumbers?: PageNumberConfig;

  // Content options
  generateTOC: boolean;
  chapterPageBreaks: boolean;

  // Advanced options
  trimSize?: { width: number; height: number }; // For print books
  bleed?: boolean; // For print books with images
  alignment?: 'left' | 'justified';

  // User metadata for headers
  authorName?: string;
  bookTitle?: string;
}

// Preset defaults
export const FORMAT_PRESETS: Record<FormatPreset, Partial<FormatOptions>> = {
  'ebook': {
    preset: 'ebook',
    // Default to traditional indents (fiction style) - users can toggle to block paragraphs in advanced options
    indent: { enabled: true, size: 0.5, skipFirstParagraph: true },
    spacing: { lineHeight: 'single', beforeParagraph: 0, afterParagraph: 0 },
    font: { family: 'Georgia', size: 12, chapterHeadingSize: 18, chapterHeadingTopMargin: 0 },
    typography: { curlyQuotes: true, emDashes: true, ellipsis: true },
    generateTOC: true,
    chapterPageBreaks: true,
    alignment: 'left',
    margins: { top: 0.5, bottom: 0.5, inside: 0.5, outside: 0.5 },
  },
  'print': {
    preset: 'print',
    indent: { enabled: true, size: 0.5, skipFirstParagraph: true },
    spacing: { lineHeight: 'single', beforeParagraph: 0, afterParagraph: 0 },
    font: { family: 'Garamond', size: 10, chapterHeadingSize: 24, chapterHeadingTopMargin: 1.5 },
    typography: { curlyQuotes: true, emDashes: true, ellipsis: true },
    generateTOC: true,
    chapterPageBreaks: true,
    alignment: 'justified',
    margins: { top: 0.75, bottom: 0.75, inside: 0.5, outside: 0.25, calculateByPageCount: true },
    trimSize: { width: 6, height: 9 },
    headers: {
      enabled: true,
      oddPageHeader: 'Book Title',
      evenPageHeader: 'Author Name',
      position: 'center',
      removeOnChapterPages: true,
    },
    pageNumbers: {
      enabled: true,
      style: 'arabic',
      position: 'bottom-center',
      startAt: 1,
      frontMatterStyle: 'roman',
    },
  },
  'manuscript-submission': {
    preset: 'manuscript-submission',
    indent: { enabled: true, size: 0.5, skipFirstParagraph: false },
    spacing: { lineHeight: 'double', beforeParagraph: 0, afterParagraph: 0 },
    font: { family: 'Times New Roman', size: 12, chapterHeadingSize: 12, chapterHeadingTopMargin: 0 },
    typography: { curlyQuotes: false, emDashes: false, ellipsis: false }, // Keep simple for editing
    generateTOC: false,
    chapterPageBreaks: true,
    alignment: 'left',
    margins: { top: 1, bottom: 1, inside: 1, outside: 1 },
    trimSize: { width: 8.5, height: 11 },
    headers: {
      enabled: true,
      oddPageHeader: 'Author Name / Book Title',
      evenPageHeader: 'Author Name / Book Title',
      position: 'inside',
      removeOnChapterPages: false,
    },
    pageNumbers: {
      enabled: true,
      style: 'arabic',
      position: 'top-inside',
      startAt: 1,
    },
  },
};
