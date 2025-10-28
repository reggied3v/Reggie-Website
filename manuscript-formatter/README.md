# Manuscript Formatter

A web application that helps authors format their Word documents for Kindle publishing in seconds.

![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)

## 🚀 Quick Start

**Development server is running at: http://localhost:3000**

1. **Test locally**: Upload `test-manuscript.docx` (already created)
2. **Set up Supabase**: Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
3. **Deploy to Vercel**: Follow [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

**📚 Documentation:**
- [QUICK_START.md](QUICK_START.md) - Complete quick reference
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database setup guide
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deployment guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Detailed project status

## ✨ Features

### Core Functionality
- ✅ **Drag-and-drop file upload** - Intuitive UI with visual feedback
- ✅ **Smart chapter detection** - Recognizes various formats:
  - "Chapter 1", "Chapter One"
  - "Prologue", "Epilogue"
  - "Ch. 1", "1."
  - Front matter (Dedication, Acknowledgments, etc.)
- ✅ **Typography fixes**:
  - Straight quotes → curly quotes (" " and ' ')
  - Double hyphens (--) → em-dashes (—)
  - Triple dots (...) → ellipsis (…)
  - Removes extra spaces
- ✅ **Professional formatting**:
  - Page breaks before chapters
  - 0.5" first-line paragraph indents
  - No indent on first paragraph of sections
  - Proper line spacing
- ✅ **Table of Contents** - Auto-generated from detected chapters
- ✅ **Instant download** - Get Kindle-ready .docx file
- ✅ **User feedback system** - Collects anonymous feedback via Supabase

### Technical Features
- ⚡ **Fast processing** - In-memory file handling
- 🔒 **Privacy-first** - No files stored on servers
- 📱 **Responsive design** - Works on desktop and mobile
- ✅ **File validation** - Type and size checks
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🔄 **Real-time status** - Loading animations and progress indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Document Processing**: docx, pizzip
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **File Handling**: Next.js API Routes

## 📁 Project Structure

```
manuscript-formatter/
├── app/
│   ├── api/
│   │   ├── upload/route.ts         # File upload & processing
│   │   └── feedback/route.ts       # Feedback submission
│   ├── page.tsx                    # Main application page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── FileUpload.tsx              # Drag-drop upload UI
│   ├── ProcessingIndicator.tsx    # Loading animation
│   ├── DownloadSection.tsx         # Download UI
│   └── FeedbackForm.tsx            # Feedback form
├── lib/
│   ├── document-processor.ts       # Core formatting logic
│   └── supabase.ts                 # Supabase client
├── types/
│   └── index.ts                    # TypeScript definitions
├── test-manuscript.docx            # Test file (generated)
├── .env.local                      # Environment variables (not in git)
└── Documentation files             # Setup and deployment guides
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free)
- Vercel account (free) - for deployment

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Testing

```bash
# Create test document
node create-test-doc.js

# Upload test-manuscript.docx to http://localhost:3000
# Download formatted file and verify in Word

# TypeScript check
npx tsc --noEmit

# Build check
npm run build
```

## 📖 API Endpoints

### POST `/api/upload`

Upload and process a manuscript file.

**Request:**
```typescript
Content-Type: multipart/form-data
Body: { file: File } // .docx file
```

**Response:**
```typescript
// Success: Returns processed .docx file as blob
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document

// Error: JSON response
{ success: false, error: string }
```

**Validations:**
- File type: `.docx` only
- File size: Maximum 5MB

### POST `/api/feedback`

Submit user feedback.

**Request:**
```typescript
Content-Type: application/json
{
  wasHelpful: boolean,
  easyToUse: boolean,
  formattingAccurate: boolean,
  wouldRecommend: boolean,
  additionalComments?: string
}
```

**Response:**
```typescript
{ success: true, data: object }
// or
{ success: false, error: string }
```

## 🧪 Testing the App

### Local Testing

1. **Run dev server**: `npm run dev`
2. **Upload test file**: `test-manuscript.docx` (already created)
3. **Verify formatting**:
   - Chapters detected correctly
   - Typography fixes applied
   - Table of Contents generated
   - Proper paragraph formatting
4. **Test feedback**: Submit and check Supabase

### What to Check

- ✅ File upload works (drag-and-drop and click)
- ✅ Processing animation appears
- ✅ Download button works
- ✅ Formatted file opens in Word
- ✅ Chapters have page breaks
- ✅ Quotes are curly (not straight)
- ✅ Em-dashes instead of double hyphens
- ✅ Table of Contents present
- ✅ Feedback saves to database

## 🚀 Deployment

### Vercel Deployment (Recommended)

**No custom domain required!** Vercel provides a free subdomain.

1. Follow [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
2. Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to verify everything

**Quick steps:**
```bash
# Push to GitHub
git add .
git commit -m "Deploy Manuscript Formatter"
git push origin main

# Import to Vercel
# - Connect GitHub repository
# - Add environment variables
# - Deploy!

# Your app will be live at:
# https://manuscript-formatter-XXXX.vercel.app
```

## 🔐 Environment Variables

Required for production:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |

## 📊 Supabase Schema

```sql
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  was_helpful BOOLEAN NOT NULL DEFAULT false,
  easy_to_use BOOLEAN NOT NULL DEFAULT false,
  formatting_accurate BOOLEAN NOT NULL DEFAULT false,
  would_recommend BOOLEAN NOT NULL DEFAULT false,
  additional_comments TEXT
);
```

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for complete setup.

## 🎯 Current Status

✅ **MVP Complete - Ready for Production**

- ✅ Full UI implementation
- ✅ Core document processing
- ✅ Supabase integration
- ✅ Error handling
- ✅ TypeScript compilation passing
- ✅ Test document included
- ✅ Complete documentation

## 💡 Usage

1. **Upload**: Drag .docx file or click to browse
2. **Processing**: Watch the progress animation
3. **Download**: Click big download button
4. **Feedback**: Optionally submit feedback (helps us improve!)

## 🐛 Known Limitations (v1.0)

- Output format: .docx only (no EPUB yet)
- File size limit: 5MB
- Anonymous usage only (no user accounts)
- Chapter detection: Pattern-based (may need manual review)

## 🔮 Future Enhancements

- [ ] EPUB format support
- [ ] PDF output option
- [ ] User accounts with history
- [ ] Batch processing
- [ ] Custom formatting options
- [ ] More chapter detection patterns
- [ ] Real-time preview
- [ ] Analytics dashboard

## 🤝 Contributing

This is currently a solo project. Contributions welcome!

## 📝 License

TBD

## 🆘 Support

- **Documentation**: Check the guides in this repository
- **Issues**: Use GitHub Issues for bug reports
- **Questions**: See [QUICK_START.md](QUICK_START.md)

## 🎉 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [docx](https://docx.js.org/)
- [Vercel](https://vercel.com/)

---

**Ready to format manuscripts for Kindle? Start at http://localhost:3000!**

For deployment, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - **no custom domain needed!**
