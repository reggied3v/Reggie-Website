import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "What does the formatter do to my manuscript?",
      answer: "The formatter automatically detects chapters, prologues, and epilogues and adds proper page breaks. It converts straight quotes to curly quotes (\"\"), double hyphens (--) to em-dashes (—), and triple dots (...) to ellipsis (…). It also applies professional 0.5 inch first-line indents to paragraphs (except the first paragraph after chapter headings) and generates a clickable table of contents."
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
      answer: "The maximum file size is 5MB. Most manuscripts under 150,000 words fit comfortably within this limit. If your file is larger, try removing images or compressing them, or split your manuscript into sections and format them separately."
    },
    {
      question: "Can I undo the formatting if I don't like it?",
      answer: "Absolutely! The formatter doesn't modify your original file. When you upload a file, we process it and create a new formatted copy for download. Your original manuscript remains completely untouched on your computer. You can always go back to it if you're not happy with the formatting."
    },
    {
      question: "How do I convert my file to .docx format?",
      answer: "Converting to .docx is easy:\n\n• Google Docs: File → Download → Microsoft Word (.docx)\n• Pages (Mac): File → Export To → Word\n• LibreOffice: File → Save As → select .docx format\n• Most word processors have a \"Save As\" or \"Export\" option where you can choose .docx format."
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
