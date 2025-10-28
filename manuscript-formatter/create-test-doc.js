// Script to create a test manuscript document
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

// Create a test document with common formatting issues
const doc = new Document({
  sections: [{
    children: [
      // Title page
      new Paragraph({
        children: [
          new TextRun({
            text: "The Great Adventure",
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "A Test Novel",
            size: 24,
          }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({
            text: "by John Doe",
            italics: true,
          }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Copyright page
      new Paragraph({
        text: "Copyright",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Copyright © 2025 by John Doe",
      }),
      new Paragraph({
        text: "All rights reserved.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Dedication
      new Paragraph({
        text: "Dedication",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "For my readers, who make this journey worthwhile.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Prologue with formatting issues
      new Paragraph({
        text: "Prologue",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: 'The rain fell in sheets--no, it poured like the heavens themselves had opened. "This is it," she whispered to herself. "This is where it all begins..."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "She hadn't expected this.  Not today.  Not ever.  But here she was, standing at the edge of everything she'd ever known, ready to leap.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Chapter 1 with various issues
      new Paragraph({
        text: "Chapter 1",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: 'The morning started like any other. Coffee--black, no sugar--and the newspaper spread across the kitchen table. "Another day," Marcus muttered.',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "But this wasn't just another day.  This was the day that would change everything.  He didn't know it yet, but fate had other plans.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "The phone rang.  Once.  Twice.  Three times before he picked it up. 'Hello?' he said cautiously.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: '"Marcus, it\'s Sarah," the voice on the other end said. "We need to talk...it\'s urgent."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: 'His heart raced--what could be so urgent? "I\'ll be right there," he replied, already grabbing his keys.',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Chapter 2
      new Paragraph({
        text: "Chapter Two",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "The drive took forever.  Traffic was backed up for miles--typical Monday morning chaos.  Marcus drummed his fingers on the steering wheel, anxiety building with each passing minute.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "When he finally arrived, Sarah was waiting outside.  Her expression said it all.  Something was very, very wrong.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: '"You\'re not going to believe this," she said, pulling out a folder. "Look at these documents."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Marcus scanned the pages.  His eyes widened.  This couldn't be real.  But there it was, in black and white--proof of everything they'd suspected.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Chapter 3
      new Paragraph({
        text: "Chapter 3",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: '"We have to go to the authorities," Marcus said firmly.  "This is bigger than us."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Sarah shook her head.  \"It's not that simple--you know that.  If we go public now, they'll bury this...and us along with it.\"",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "She was right, of course.  She usually was.  But what choice did they have?  Sit on this information and let the corruption continue?  Or risk everything to expose the truth?",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: '"We need more evidence," Sarah continued. "Solid proof that can\'t be disputed or dismissed."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Marcus nodded slowly.  It was risky--dangerous even--but it was their only option.  \"Okay,\" he said. \"Let's do it.  Let's finish this.\"",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "" }),

      // Epilogue
      new Paragraph({
        text: "Epilogue",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Three months later, Marcus stood in front of the courthouse.  The trial was over.  Justice had been served.  It wasn't the ending he'd expected, but it was the right one.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "Sarah appeared beside him, a small smile on her face.  \"We did it,\" she said quietly.",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: '"Yeah," Marcus replied. "We did."',
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "And for the first time in months, he felt like he could finally breathe.",
      }),
    ],
  }],
});

// Generate the document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("test-manuscript.docx", buffer);
  console.log("✅ Test manuscript created: test-manuscript.docx");
  console.log("");
  console.log("📝 This document contains:");
  console.log("   - Title page, Copyright, Dedication");
  console.log("   - Prologue and Epilogue");
  console.log("   - 3 Chapters with various naming styles");
  console.log("   - Straight quotes (should become curly)");
  console.log("   - Double hyphens -- (should become em-dashes)");
  console.log("   - Triple dots ... (should become ellipsis)");
  console.log("   - Double spaces  (should be removed)");
  console.log("");
  console.log("🧪 Upload this to http://localhost:3000 to test formatting!");
});
