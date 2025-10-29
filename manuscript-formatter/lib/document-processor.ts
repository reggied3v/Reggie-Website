import PizZip from 'pizzip';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, InternalHyperlink, Bookmark, PageMargin, Header, Footer, PageNumber, NumberFormat } from 'docx';
import { Chapter, DocumentMetadata, FormatOptions, FORMAT_PRESETS } from '@/types';

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
 * Converts line height setting to twips for docx
 * Single = 240, 1.15 = 276, 1.5 = 360, Double = 480
 */
function convertLineHeightToTwips(lineHeight: 'single' | '1.15' | '1.5' | 'double'): number {
  const lineHeightMap = {
    'single': 240,
    '1.15': 276,
    '1.5': 360,
    'double': 480,
  };
  return lineHeightMap[lineHeight];
}

/**
 * Estimates page count based on paragraph count for dynamic margin calculation
 * Rough estimate: ~35 lines per page at single spacing, ~25 at double
 * Average ~2-3 paragraphs per page for fiction
 */
function estimatePageCount(paragraphCount: number, lineHeight: 'single' | '1.15' | '1.5' | 'double'): number {
  // Adjust estimate based on line spacing
  const paragraphsPerPageMap = {
    'single': 3,
    '1.15': 2.5,
    '1.5': 2,
    'double': 1.5,
  };

  const paragraphsPerPage = paragraphsPerPageMap[lineHeight];
  return Math.ceil(paragraphCount / paragraphsPerPage);
}

/**
 * Calculates margins based on estimated page count (for print books)
 * Based on KDP guidelines:
 * - 24-150 pages: Inside 0.375", Outside 0.25"
 * - 151-300 pages: Inside 0.5", Outside 0.25"
 * - 301-500 pages: Inside 0.625", Outside 0.25"
 * - 501+ pages: Inside 0.75", Outside 0.25"
 */
function calculateMarginsForPageCount(
  estimatedPageCount: number,
  baseMargins: { top: number; bottom: number; inside: number; outside: number }
): { top: number; bottom: number; left: number; right: number } {
  let insideMargin = baseMargins.inside;

  // Apply page count-based adjustments
  if (estimatedPageCount >= 501) {
    insideMargin = 0.75;
  } else if (estimatedPageCount >= 301) {
    insideMargin = 0.625;
  } else if (estimatedPageCount >= 151) {
    insideMargin = 0.5;
  } else if (estimatedPageCount >= 24) {
    insideMargin = 0.375;
  }

  // For mirror margins in print books, inside becomes left on odd pages, right on even pages
  // docx library handles this automatically with PageMargin settings
  return {
    top: baseMargins.top,
    bottom: baseMargins.bottom,
    left: baseMargins.outside,  // Outside margin (for left page in spread)
    right: insideMargin,         // Inside margin (gutter)
  };
}

/**
 * Fixes typography in text based on format options
 */
function fixTypography(text: string, typographyConfig: { curlyQuotes: boolean; emDashes: boolean; ellipsis: boolean }): string {
  // First decode any HTML entities
  let fixed = decodeHtmlEntities(text);

  // Fix straight quotes to curly quotes (if enabled)
  if (typographyConfig.curlyQuotes) {
    fixed = fixed.replace(/(?<=\s|^)"([^"]*)"/g, '\u201c$1\u201d'); // Double quotes
    fixed = fixed.replace(/(?<=\s|^)'([^']*)'/g, '\u2018$1\u2019'); // Single quotes
  }

  // Fix double hyphens to em-dash (if enabled)
  if (typographyConfig.emDashes) {
    fixed = fixed.replace(/--/g, '\u2014');
  }

  // Fix triple dots to ellipsis (if enabled)
  if (typographyConfig.ellipsis) {
    fixed = fixed.replace(/\.\.\./g, '\u2026');
  }

  // Remove double spaces
  fixed = fixed.replace(/  +/g, ' ');

  return fixed;
}

/**
 * Creates page number format based on style
 */
function getPageNumberFormat(style: 'arabic' | 'roman' | 'Roman'): typeof NumberFormat.DECIMAL {
  switch (style) {
    case 'roman':
      return NumberFormat.LOWER_ROMAN;
    case 'Roman':
      return NumberFormat.UPPER_ROMAN;
    case 'arabic':
    default:
      return NumberFormat.DECIMAL;
  }
}

/**
 * Creates a paragraph with page number
 */
function createPageNumberParagraph(alignment: AlignmentType, numberFormat: NumberFormat): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        children: [new PageNumber()],
        size: 20, // 10pt font
      }),
    ],
    alignment,
  });
}

/**
 * Creates header and footer objects based on format options
 */
function createHeadersFooters(options: FormatOptions) {
  const headers: { default?: Header; even?: Header; first?: Header } = {};
  const footers: { default?: Footer; even?: Footer; first?: Footer } = {};

  const hasHeaders = options.headers?.enabled;
  const hasPageNumbers = options.pageNumbers?.enabled;

  if (!hasHeaders && !hasPageNumbers) {
    return { headers: undefined, footers: undefined };
  }

  const headerConfig = options.headers;
  const pageNumConfig = options.pageNumbers;

  // Determine alignment for headers/footers based on position
  let alignment = AlignmentType.CENTER;
  if (headerConfig?.position === 'inside') {
    alignment = AlignmentType.LEFT; // Inside for odd pages (left-aligned)
  } else if (headerConfig?.position === 'outside') {
    alignment = AlignmentType.RIGHT; // Outside for odd pages (right-aligned)
  }

  // Determine alignment for page numbers
  let pageNumAlignment = AlignmentType.CENTER;
  if (pageNumConfig?.enabled) {
    const pos = pageNumConfig.position;
    if (pos.includes('inside')) {
      pageNumAlignment = AlignmentType.LEFT; // Inside for odd pages
    } else if (pos.includes('outside')) {
      pageNumAlignment = AlignmentType.RIGHT; // Outside for odd pages
    } else if (pos.includes('center')) {
      pageNumAlignment = AlignmentType.CENTER;
    }
  }

  const pageNumFormat = pageNumConfig?.enabled ? getPageNumberFormat(pageNumConfig.style) : NumberFormat.DECIMAL;
  const isPageNumInHeader = pageNumConfig?.enabled && pageNumConfig.position.startsWith('top');
  const isPageNumInFooter = pageNumConfig?.enabled && pageNumConfig.position.startsWith('bottom');

  // Create odd page header (default)
  const oddHeaderParagraphs: Paragraph[] = [];
  if (hasHeaders && headerConfig?.oddPageHeader) {
    oddHeaderParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: headerConfig.oddPageHeader,
            size: 20, // 10pt font for headers
            language: { value: 'en-US' },
          }),
        ],
        alignment,
      })
    );
  }
  if (isPageNumInHeader) {
    oddHeaderParagraphs.push(createPageNumberParagraph(pageNumAlignment, pageNumFormat));
  }
  if (oddHeaderParagraphs.length > 0) {
    headers.default = new Header({ children: oddHeaderParagraphs });
  }

  // Create even page header
  const evenAlignment = headerConfig?.position === 'inside'
    ? AlignmentType.RIGHT  // Inside for even pages is right-aligned
    : headerConfig?.position === 'outside'
    ? AlignmentType.LEFT   // Outside for even pages is left-aligned
    : AlignmentType.CENTER;

  const evenPageNumAlignment = pageNumConfig?.position.includes('inside')
    ? AlignmentType.RIGHT  // Inside for even pages
    : pageNumConfig?.position.includes('outside')
    ? AlignmentType.LEFT   // Outside for even pages
    : AlignmentType.CENTER;

  const evenHeaderParagraphs: Paragraph[] = [];
  if (hasHeaders && headerConfig?.evenPageHeader) {
    evenHeaderParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: headerConfig.evenPageHeader,
            size: 20,
            language: { value: 'en-US' },
          }),
        ],
        alignment: evenAlignment,
      })
    );
  }
  if (isPageNumInHeader) {
    evenHeaderParagraphs.push(createPageNumberParagraph(evenPageNumAlignment, pageNumFormat));
  }
  if (evenHeaderParagraphs.length > 0) {
    headers.even = new Header({ children: evenHeaderParagraphs });
  }

  // Create odd page footer (default)
  const oddFooterParagraphs: Paragraph[] = [];
  if (hasHeaders && headerConfig?.oddPageFooter) {
    oddFooterParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: headerConfig.oddPageFooter,
            size: 20,
            language: { value: 'en-US' },
          }),
        ],
        alignment,
      })
    );
  }
  if (isPageNumInFooter) {
    oddFooterParagraphs.push(createPageNumberParagraph(pageNumAlignment, pageNumFormat));
  }
  if (oddFooterParagraphs.length > 0) {
    footers.default = new Footer({ children: oddFooterParagraphs });
  }

  // Create even page footer
  const evenFooterParagraphs: Paragraph[] = [];
  if (hasHeaders && headerConfig?.evenPageFooter) {
    evenFooterParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: headerConfig.evenPageFooter,
            size: 20,
            language: { value: 'en-US' },
          }),
        ],
        alignment: evenAlignment,
      })
    );
  }
  if (isPageNumInFooter) {
    evenFooterParagraphs.push(createPageNumberParagraph(evenPageNumAlignment, pageNumFormat));
  }
  if (evenFooterParagraphs.length > 0) {
    footers.even = new Footer({ children: evenFooterParagraphs });
  }

  return {
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    footers: Object.keys(footers).length > 0 ? footers : undefined,
    pageNumberFormat: pageNumFormat,
  };
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
 * Processes a manuscript .docx file with format options
 */
export async function processManuscript(
  buffer: Buffer,
  originalFileName: string,
  formatOptions?: Partial<FormatOptions>
): Promise<ProcessingResult> {
  // Merge with default eBook preset if no options provided
  const options: FormatOptions = {
    ...(FORMAT_PRESETS['ebook'] as FormatOptions),
    ...formatOptions,
  };
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
        // Fix typography based on format options
        const fixedText = fixTypography(text, options.typography);

        // Apply paragraph formatting based on format options
        const shouldIndent = options.indent.enabled && !(isFirstParagraphOfSection && options.indent.skipFirstParagraph);
        const indent = shouldIndent ? convertInchesToTwip(options.indent.size) : 0;

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
              before: options.spacing.beforeParagraph,
              after: options.spacing.afterParagraph,
              line: convertLineHeightToTwips(options.spacing.lineHeight),
            },
            alignment: options.alignment === 'justified' ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
          })
        );

        isFirstParagraphOfSection = false;
      }
    });

    // Create Table of Contents (if enabled in format options)
    const tocParagraphs: Paragraph[] = [];

    if (options.generateTOC) {
      tocParagraphs.push(
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
        })
      );

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
    }

    // Combine TOC + document content
    const allParagraphs = [...tocParagraphs, ...documentParagraphs];

    // Calculate margins (dynamic for print books with calculateByPageCount enabled)
    let finalMargins = {
      top: convertInchesToTwip(options.margins.top),
      bottom: convertInchesToTwip(options.margins.bottom),
      left: convertInchesToTwip(options.margins.outside),
      right: convertInchesToTwip(options.margins.inside),
    };

    if (options.margins.calculateByPageCount) {
      const estimatedPages = estimatePageCount(paragraphs.length, options.spacing.lineHeight);
      const calculatedMargins = calculateMarginsForPageCount(estimatedPages, options.margins);
      finalMargins = {
        top: convertInchesToTwip(calculatedMargins.top),
        bottom: convertInchesToTwip(calculatedMargins.bottom),
        left: convertInchesToTwip(calculatedMargins.left),
        right: convertInchesToTwip(calculatedMargins.right),
      };
    }

    // Substitute author name and book title in headers/footers if provided
    if (options.headers && (options.authorName || options.bookTitle)) {
      if (options.headers.oddPageHeader) {
        options.headers.oddPageHeader = options.headers.oddPageHeader
          .replace('Author Name', options.authorName || 'Author Name')
          .replace('Book Title', options.bookTitle || 'Book Title');
      }
      if (options.headers.evenPageHeader) {
        options.headers.evenPageHeader = options.headers.evenPageHeader
          .replace('Author Name', options.authorName || 'Author Name')
          .replace('Book Title', options.bookTitle || 'Book Title');
      }
      if (options.headers.oddPageFooter) {
        options.headers.oddPageFooter = options.headers.oddPageFooter
          .replace('Author Name', options.authorName || 'Author Name')
          .replace('Book Title', options.bookTitle || 'Book Title');
      }
      if (options.headers.evenPageFooter) {
        options.headers.evenPageFooter = options.headers.evenPageFooter
          .replace('Author Name', options.authorName || 'Author Name')
          .replace('Book Title', options.bookTitle || 'Book Title');
      }
    }

    // Create headers and footers
    const { headers, footers, pageNumberFormat } = createHeadersFooters(options);

    // Create new document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: finalMargins,
              // Set page size if trim size is specified (for print books)
              ...(options.trimSize && {
                size: {
                  width: convertInchesToTwip(options.trimSize.width),
                  height: convertInchesToTwip(options.trimSize.height),
                },
              }),
              // Set page number format and start
              ...(options.pageNumbers?.enabled && {
                pageNumbers: {
                  start: options.pageNumbers.startAt,
                  formatType: pageNumberFormat,
                },
              }),
            },
            // Enable different headers for odd and even pages
            ...((headers || footers) && {
              titlePage: false,
              differentOddAndEvenPages: true
            }),
          },
          headers,
          footers,
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
