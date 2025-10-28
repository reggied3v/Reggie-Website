import PizZip from 'pizzip';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, InternalHyperlink, Bookmark } from 'docx';
import { Chapter, DocumentMetadata } from '@/types';

interface ProcessingResult {
  success: boolean;
  buffer?: Buffer;
  fileName?: string;
  error?: string;
  metadata?: DocumentMetadata;
}

/**
 * Detects chapter headings in a paragraph text
 */
function isChapterHeading(text: string): { isChapter: boolean; type: Chapter['type']; title: string } {
  const trimmed = text.trim();

  // Check for common chapter patterns
  const chapterPatterns = [
    /^chapter\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)/i,
    /^ch\.?\s+(\d+)/i,
    /^(\d+)\.\s+/,
  ];

  const specialPatterns = [
    { regex: /^prologue/i, type: 'prologue' as const },
    { regex: /^epilogue/i, type: 'epilogue' as const },
    { regex: /^(foreword|preface|introduction|dedication|acknowledgments?)/i, type: 'front-matter' as const },
  ];

  // Check special patterns first
  for (const pattern of specialPatterns) {
    if (pattern.regex.test(trimmed)) {
      return { isChapter: true, type: pattern.type, title: trimmed };
    }
  }

  // Check chapter patterns
  for (const pattern of chapterPatterns) {
    if (pattern.test(trimmed)) {
      return { isChapter: true, type: 'chapter', title: trimmed };
    }
  }

  return { isChapter: false, type: 'chapter', title: '' };
}

/**
 * Decodes HTML entities in text
 */
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&quot;': '"',
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
  };

  return text.replace(/&quot;|&apos;|&lt;|&gt;|&amp;/g, (match) => entities[match] || match);
}

/**
 * Normalizes chapter titles for consistent TOC formatting
 */
function normalizeChapterTitle(title: string, chapterNumber: number, type: Chapter['type']): string {
  // Keep special chapters as-is
  if (type === 'prologue' || type === 'epilogue' || type === 'front-matter') {
    return title;
  }

  // Normalize regular chapters to "Chapter X" format
  return `Chapter ${chapterNumber}`;
}

/**
 * Fixes typography in text
 */
function fixTypography(text: string): string {
  // First decode any HTML entities
  let fixed = decodeHtmlEntities(text);

  // Fix straight quotes to curly quotes
  fixed = fixed.replace(/(?<=\s|^)"([^"]*)"/g, '\u201c$1\u201d'); // Double quotes
  fixed = fixed.replace(/(?<=\s|^)'([^']*)'/g, '\u2018$1\u2019'); // Single quotes

  // Fix double hyphens to em-dash
  fixed = fixed.replace(/--/g, '\u2014');

  // Fix triple dots to ellipsis
  fixed = fixed.replace(/\.\.\./g, '\u2026');

  // Remove double spaces
  fixed = fixed.replace(/  +/g, ' ');

  return fixed;
}

/**
 * Extracts text content from .docx file
 */
async function extractDocxContent(buffer: Buffer): Promise<{ paragraphs: string[] }> {
  try {
    const zip = new PizZip(buffer);
    const xml = zip.file('word/document.xml')?.asText();

    if (!xml) {
      throw new Error('Invalid .docx file: document.xml not found');
    }

    // Extract text from XML (basic parsing)
    const paragraphs: string[] = [];
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    const paraRegex = /<w:p[^>]*>[\s\S]*?<\/w:p>/g;

    const paraMatches = xml.match(paraRegex) || [];

    for (const para of paraMatches) {
      let paraText = '';
      let match;
      const localTextRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;

      while ((match = localTextRegex.exec(para)) !== null) {
        paraText += match[1];
      }

      if (paraText.trim()) {
        paragraphs.push(paraText.trim());
      }
    }

    return { paragraphs };
  } catch (error) {
    console.error('Error extracting docx content:', error);
    throw new Error('Failed to read .docx file');
  }
}

/**
 * Processes a manuscript .docx file
 */
export async function processManuscript(
  buffer: Buffer,
  originalFileName: string
): Promise<ProcessingResult> {
  try {
    // Extract content from the uploaded .docx
    const { paragraphs } = await extractDocxContent(buffer);

    if (paragraphs.length === 0) {
      return {
        success: false,
        error: 'Document appears to be empty'
      };
    }

    // Detect chapters
    const chapters: Chapter[] = [];
    const documentParagraphs: Paragraph[] = [];
    let isFirstParagraphOfSection = true;

    paragraphs.forEach((text, index) => {
      const chapterCheck = isChapterHeading(text);

      if (chapterCheck.isChapter) {
        // Add page break before chapter (except for the very first one)
        if (chapters.length > 0) {
          documentParagraphs.push(
            new Paragraph({
              pageBreakBefore: true,
            })
          );
        }

        // Generate unique bookmark ID for this chapter
        const bookmarkId = `chapter_${chapters.length + 1}`;

        // Add chapter to list
        chapters.push({
          title: chapterCheck.title,
          heading: chapterCheck.title,
          startIndex: index,
          type: chapterCheck.type
        });

        // Add chapter heading with bookmark
        documentParagraphs.push(
          new Paragraph({
            children: [
              new Bookmark({
                id: bookmarkId,
                children: [
                  new TextRun({
                    text: chapterCheck.title,
                    bold: true,
                    language: {
                      value: 'en-US',
                    },
                  }),
                ],
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240, // spacing after heading
            },
          })
        );

        isFirstParagraphOfSection = true;
      } else {
        // Fix typography
        const fixedText = fixTypography(text);

        // Apply paragraph formatting
        const indent = isFirstParagraphOfSection ? 0 : convertInchesToTwip(0.5);

        documentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: fixedText,
                language: {
                  value: 'en-US',
                },
              }),
            ],
            indent: {
              firstLine: indent,
            },
            spacing: {
              after: 0,
              line: 276, // 1.15 line spacing
            },
          })
        );

        isFirstParagraphOfSection = false;
      }
    });

    // Create Table of Contents
    const tocParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Table of Contents',
            bold: true,
            language: {
              value: 'en-US',
            },
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }),
    ];

    // Track chapter numbers for normalization
    let chapterCount = 0;
    chapters.forEach((chapter, index) => {
      // Increment chapter count only for regular chapters
      if (chapter.type === 'chapter') {
        chapterCount++;
      }

      // Use normalized title for TOC
      const tocTitle = normalizeChapterTitle(chapter.title, chapterCount, chapter.type);

      // Generate bookmark ID that matches the one created for the chapter
      const bookmarkId = `chapter_${index + 1}`;

      // Create hyperlink to chapter
      tocParagraphs.push(
        new Paragraph({
          children: [
            new InternalHyperlink({
              anchor: bookmarkId,
              children: [
                new TextRun({
                  text: tocTitle,
                  style: 'Hyperlink',
                  language: {
                    value: 'en-US',
                  },
                }),
              ],
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });

    // Add page break after TOC
    tocParagraphs.push(
      new Paragraph({
        pageBreakBefore: true,
      })
    );

    // Combine TOC + document content
    const allParagraphs = [...tocParagraphs, ...documentParagraphs];

    // Create new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: allParagraphs,
        },
      ],
    });

    // Generate buffer
    const processedBuffer = await Packer.toBuffer(doc);

    const metadata: DocumentMetadata = {
      totalParagraphs: paragraphs.length,
      chaptersDetected: chapters.length,
      chapters,
      hasFrontMatter: chapters.some(ch => ch.type === 'front-matter')
    };

    return {
      success: true,
      buffer: processedBuffer,
      fileName: `formatted-${originalFileName}`,
      metadata
    };

  } catch (error) {
    console.error('Processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown processing error'
    };
  }
}
