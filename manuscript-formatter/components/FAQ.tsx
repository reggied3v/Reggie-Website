import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "What format options are available?",
      answer: "We offer 3 professional format presets:\n\n• eBook (Kindle/ePub): Optimized for digital reading with indented paragraphs, single spacing, and clickable TOC\n• Print Book (Paperback/Hardcover): KDP-compliant formatting with dynamic margins, justified text, headers, and page numbers. Interior formatting is identical for paperback and hardcover.\n• Manuscript Submission: Standard format for agents/publishers with double-spacing, 1\" margins, and Times New Roman\n\nEach preset can be customized with advanced options for paragraph style, line spacing, typography fixes, and more."
    },
    {
      question: "What does the live preview show?",
      answer: "The live preview shows your manuscript with all format options applied in real-time. You can see typography fixes (curly quotes, em-dashes), paragraph indentation, line spacing, chapter headings, and table of contents. The preview updates instantly when you change format options, so you can see exactly how your book will look before downloading. Zoom controls let you view at 50%-150% size."
    },
    {
      question: "How do I test my Kindle formatting?",
      answer: "To thoroughly test your eBook formatting:\n\n1. Download Kindle Previewer: Go to kdp.amazon.com/en_US/help/topic/G202131170 and download the free Kindle Previewer app for your computer (available for Windows and Mac).\n\n2. Install and open the app: Follow the installation instructions, then launch Kindle Previewer.\n\n3. Open your formatted file: Click \"Open Book\" and select your downloaded .docx file. Kindle Previewer will convert it and show how it will look on actual Kindle devices.\n\n4. Test on different devices: Use the device selector at the top to preview your book on Kindle, Kindle Fire tablets, and phones. Each device shows different screen sizes.\n\n5. What to check:\n   • Chapter headings start on new pages\n   • Paragraph indents are consistent\n   • Table of contents links work correctly\n   • Typography looks professional (curly quotes, em-dashes)\n   • No awkward page breaks mid-paragraph\n\n6. Make adjustments: If something doesn't look right, return to the formatter, adjust your format options, download again, and retest."
    },
    {
      question: "What's the difference between fiction and non-fiction formatting?",
      answer: "Fiction typically uses traditional first-line indents (0.5\") with no space between paragraphs. Non-fiction often uses block paragraphs (no indent) with space between paragraphs. Our eBook preset defaults to fiction style, but you can customize it in Advanced Options. Print and submission presets follow standard industry practices that work for both genres."
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, only Microsoft Word (.docx) files are supported. If you have a different format (like .doc, .pdf, or .txt), you'll need to convert it to .docx before uploading. Google Docs users can download as .docx by going to File → Download → Microsoft Word (.docx)."
    },
    {
      question: "Is my manuscript stored on your servers?",
      answer: "No! Your privacy is our priority. All processing is done anonymously and your manuscript is never stored on our servers. Once the formatting is complete and you download the file, it's immediately discarded from our system. We never see, save, or share your work."
    },
    {
      question: "What's the file size limit?",
      answer: "The maximum file size is 10MB. Most manuscripts under 250,000 words fit comfortably within this limit. If your file is larger, try removing images or compressing them, or split your manuscript into sections and format them separately."
    },
    {
      question: "Can I undo the formatting if I don't like it?",
      answer: "Absolutely! The formatter doesn't modify your original file. When you upload a file, we process it and create a new formatted copy for download. Your original manuscript remains completely untouched on your computer. You can always go back to it if you're not happy with the formatting."
    },
    {
      question: "How do print margins work?",
      answer: "For print books (paperback/hardcover), margins are automatically calculated based on your manuscript's estimated page count, following Amazon KDP guidelines:\n\n• 24-150 pages: 0.375\" inside margin\n• 151-300 pages: 0.5\" inside margin\n• 301-500 pages: 0.625\" inside margin\n• 501+ pages: 0.75\" inside margin\n\nThis ensures proper binding space for thicker books. You can enter your author name and book title for headers on alternating pages."
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-foreground hover:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
