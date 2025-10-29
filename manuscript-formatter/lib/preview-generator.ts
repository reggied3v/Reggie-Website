import PizZip from 'pizzip';
import { FormatOptions, Chapter } from '@/types';

interface PreviewData {
  html: string;
  chapters: Chapter[];
  paragraphCount: number;
}

/**
 * Detects chapter headings in a paragraph text
 */
function isChapterHeading(text: string): { isChapter: boolean; type: Chapter['type']; title: string } {
  const trimmed = text.trim();

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

  for (const pattern of specialPatterns) {
    if (pattern.regex.test(trimmed)) {
      return { isChapter: true, type: pattern.type, title: trimmed };
    }
  }

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
 * Fixes typography in text based on format options
 */
function fixTypography(text: string, typographyConfig: { curlyQuotes: boolean; emDashes: boolean; ellipsis: boolean }): string {
  let fixed = decodeHtmlEntities(text);

  if (typographyConfig.curlyQuotes) {
    fixed = fixed.replace(/(?<=\s|^)"([^"]*)"/g, '\u201c$1\u201d');
    fixed = fixed.replace(/(?<=\s|^)'([^']*)'/g, '\u2018$1\u2019');
  }

  if (typographyConfig.emDashes) {
    fixed = fixed.replace(/--/g, '\u2014');
  }

  if (typographyConfig.ellipsis) {
    fixed = fixed.replace(/\.\.\./g, '\u2026');
  }

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
 * Generates preview HTML from manuscript buffer with format options
 */
export async function generatePreview(
  buffer: Buffer,
  formatOptions: FormatOptions
): Promise<PreviewData> {
  const { paragraphs } = await extractDocxContent(buffer);

  const chapters: Chapter[] = [];
  let htmlContent = '';
  let isFirstParagraphOfSection = true;

  paragraphs.forEach((text, index) => {
    const chapterCheck = isChapterHeading(text);

    if (chapterCheck.isChapter) {
      // Add page break before chapter (except for the very first one)
      if (chapters.length > 0) {
        htmlContent += '<div class="page-break"></div>';
      }

      chapters.push({
        title: chapterCheck.title,
        heading: chapterCheck.title,
        startIndex: index,
        type: chapterCheck.type
      });

      htmlContent += `<h1 class="chapter-heading" data-chapter-index="${chapters.length - 1}">${chapterCheck.title}</h1>`;
      isFirstParagraphOfSection = true;
    } else {
      const fixedText = fixTypography(text, formatOptions.typography);
      const shouldIndent = formatOptions.indent.enabled && !(isFirstParagraphOfSection && formatOptions.indent.skipFirstParagraph);

      htmlContent += `<p class="${shouldIndent ? 'indented' : 'no-indent'}">${fixedText}</p>`;
      isFirstParagraphOfSection = false;
    }
  });

  // Generate TOC if enabled
  if (formatOptions.generateTOC && chapters.length > 0) {
    let tocHtml = '<div class="toc"><h1 class="toc-heading">Table of Contents</h1>';

    let chapterCount = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.type === 'chapter') {
        chapterCount++;
      }
      const tocTitle = chapter.type === 'chapter' ? `Chapter ${chapterCount}` : chapter.title;
      tocHtml += `<p class="toc-entry"><a href="#chapter-${index}">${tocTitle}</a></p>`;
    });

    tocHtml += '</div><div class="page-break"></div>';
    htmlContent = tocHtml + htmlContent;
  }

  return {
    html: htmlContent,
    chapters,
    paragraphCount: paragraphs.length,
  };
}

/**
 * Generates CSS styles based on format options
 */
export function generatePreviewStyles(formatOptions: FormatOptions): string {
  const lineHeightMap = {
    'single': '1.0',
    '1.15': '1.15',
    '1.5': '1.5',
    'double': '2.0',
  };

  const fontSizeMap: { [key: string]: string } = {
    'Georgia': '12pt',
    'Garamond': '10pt',
    'Times New Roman': '12pt',
  };

  const fontSize = formatOptions.font.size + 'pt';
  const lineHeight = lineHeightMap[formatOptions.spacing.lineHeight];
  const textAlign = formatOptions.alignment === 'justified' ? 'justify' : 'left';
  const indentSize = formatOptions.indent.size + 'in';

  return `
    .preview-content {
      font-family: ${formatOptions.font.family}, serif;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      text-align: ${textAlign};
      color: #1a1a1a;
      padding: ${formatOptions.margins.top}in ${formatOptions.margins.outside}in ${formatOptions.margins.bottom}in ${formatOptions.margins.inside}in;
      background: white;
      max-width: 100%;
      margin: 0 auto;
    }

    .preview-content h1.chapter-heading {
      text-align: center;
      font-weight: bold;
      font-size: ${formatOptions.font.chapterHeadingSize || 24}pt;
      margin-top: ${formatOptions.font.chapterHeadingTopMargin || 0}in;
      margin-bottom: 1em;
      margin-left: 0;
      margin-right: 0;
      page-break-before: always;
    }

    .preview-content h1.chapter-heading:first-child {
      page-break-before: auto;
    }

    .preview-content p {
      margin: ${formatOptions.spacing.beforeParagraph}pt 0 ${formatOptions.spacing.afterParagraph}pt 0;
    }

    .preview-content p.indented {
      text-indent: ${indentSize};
    }

    .preview-content p.no-indent {
      text-indent: 0;
    }

    .preview-content .toc {
      margin-bottom: 2em;
    }

    .preview-content .toc h1.toc-heading {
      text-align: center;
      font-weight: bold;
      margin-bottom: 1em;
    }

    .preview-content .toc-entry {
      margin: 0.5em 0;
      text-indent: 0;
    }

    .preview-content .toc-entry a {
      color: #0066cc;
      text-decoration: none;
    }

    .preview-content .toc-entry a:hover {
      text-decoration: underline;
    }

    .preview-content .page-break {
      page-break-after: always;
      height: 3em;
      margin: 2em 0;
      border-top: 2px dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .preview-content .page-break::after {
      content: 'Page Break';
      position: absolute;
      background: white;
      padding: 0 1em;
      color: #666;
      font-size: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `;
}
