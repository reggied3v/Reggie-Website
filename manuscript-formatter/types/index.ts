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
