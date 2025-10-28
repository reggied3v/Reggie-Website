# Deployment Checklist - Manuscript Formatter

Complete this checklist before deploying to production.

## 🧪 Pre-Deployment Testing

### Local Testing

- [ ] **Dev server running**: http://localhost:3000 ✓
- [ ] **Test document created**: `test-manuscript.docx` ✓
- [ ] **Upload test file**: Drag-and-drop or click to upload
- [ ] **Processing works**: See loading animation
- [ ] **Download works**: Get formatted .docx file
- [ ] **Open formatted file**: Verify in Microsoft Word
  - [ ] Chapters detected correctly
  - [ ] Page breaks before chapters
  - [ ] Curly quotes (not straight quotes)
  - [ ] Em-dashes (not double hyphens)
  - [ ] Ellipsis (not triple dots)
  - [ ] Proper paragraph indentation
  - [ ] Table of Contents present
- [ ] **Typography fixes applied**
- [ ] **Error handling works**: Try uploading .pdf or >5MB file
- [ ] **TypeScript compiles**: Run `npx tsc --noEmit`

### Supabase Configuration

- [ ] **Supabase project created**
- [ ] **Database table created**: `feedback` table exists
- [ ] **RLS policies enabled**: Row Level Security configured
- [ ] **Credentials added**: Updated `.env.local`
- [ ] **Dev server restarted**: After adding credentials
- [ ] **Feedback submission tested**: Submit test feedback
- [ ] **Feedback visible in Supabase**: Check Table Editor

## 📦 Code Preparation

### Git & Version Control

- [ ] **Git initialized**: `git init` (if needed)
- [ ] **All files committed**: `git add .` and `git commit`
- [ ] **Sensitive files ignored**: Check `.gitignore`
  - [ ] `.env.local` not in git
  - [ ] `node_modules/` ignored
  - [ ] `.next/` ignored
- [ ] **GitHub repository created**
- [ ] **Code pushed to GitHub**: `git push origin main`

### Build Verification

- [ ] **Production build succeeds**: Run `npm run build`
- [ ] **No build errors**: Check terminal output
- [ ] **No TypeScript errors**: Already checked above
- [ ] **Dependencies correct**: `package.json` up to date

## 🚀 Vercel Deployment

### Account Setup

- [ ] **Vercel account created**: https://vercel.com/signup
- [ ] **Connected to GitHub**: Authorized repository access
- [ ] **Project imported**: Found manuscript-formatter repo

### Configuration

- [ ] **Framework detected**: Next.js auto-detected
- [ ] **Build settings correct**:
  - Framework: Next.js
  - Root Directory: ./
  - Build Command: `npm run build`
  - Output Directory: `.next`
- [ ] **Environment variables added**:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deployment

- [ ] **Deploy button clicked**
- [ ] **Build successful**: Wait 2-3 minutes
- [ ] **Deployment URL received**: `https://manuscript-formatter-XXXX.vercel.app`
- [ ] **Production site accessible**: Visit URL in browser

## ✅ Post-Deployment Testing

### Production Verification

- [ ] **Site loads correctly**: No 404 or 500 errors
- [ ] **UI renders properly**: Check all components
- [ ] **Upload works in production**: Test with test-manuscript.docx
- [ ] **Processing works**: See loading states
- [ ] **Download works**: Get formatted file
- [ ] **File formatting correct**: Open in Word and verify
- [ ] **Feedback submission works**: Submit test feedback
- [ ] **Feedback saves to Supabase**: Check database

### Cross-Browser Testing

- [ ] **Chrome/Edge**: Works correctly
- [ ] **Firefox**: Works correctly
- [ ] **Safari**: Works correctly (if Mac available)
- [ ] **Mobile browser**: Responsive design works

### Performance

- [ ] **Page loads quickly**: < 3 seconds
- [ ] **File upload responsive**: Shows progress
- [ ] **Download immediate**: No long wait
- [ ] **No console errors**: Check DevTools

## 🔐 Security Verification

- [ ] **HTTPS enabled**: Automatic on Vercel ✓
- [ ] **Environment variables secure**: Not in code ✓
- [ ] **`.env.local` not committed**: Check GitHub ✓
- [ ] **Supabase RLS enabled**: Checked in setup ✓
- [ ] **API routes protected**: File size limits enforced ✓

## 📊 Monitoring Setup

### Vercel Analytics

- [ ] **Deployment logs checked**: No errors
- [ ] **Function logs reviewed**: API routes working
- [ ] **Analytics enabled**: View traffic (if needed)

### Supabase Monitoring

- [ ] **Database accessible**: Table Editor loads
- [ ] **Feedback table populated**: Test entry visible
- [ ] **API usage normal**: Check project dashboard

## 📝 Documentation

- [ ] **README.md updated**: Instructions clear
- [ ] **SUPABASE_SETUP.md available**: Setup guide complete
- [ ] **VERCEL_DEPLOYMENT.md available**: Deployment guide complete
- [ ] **Environment variables documented**: `.env.example` exists

## 🎯 Final Checks

### User Experience

- [ ] **Clear instructions**: UI is intuitive
- [ ] **Error messages helpful**: Easy to understand
- [ ] **Loading states visible**: User knows what's happening
- [ ] **Success states clear**: Confirmation messages shown

### Functionality

- [ ] **End-to-end flow works**: Upload → Process → Download → Feedback
- [ ] **Reset function works**: "Format another manuscript" button
- [ ] **Feedback optional**: Can skip feedback form
- [ ] **File validation works**: Rejects invalid files

## 🎊 Launch

- [ ] **Production URL working**: All features functional
- [ ] **Test with real users**: Share with 2-3 people
- [ ] **Monitor for issues**: Check Vercel and Supabase logs
- [ ] **Ready for public use**: Confident in stability

## 📌 Important URLs

Record these for reference:

- **Production URL**: `_______________________________`
- **GitHub Repo**: `_______________________________`
- **Vercel Dashboard**: `_______________________________`
- **Supabase Dashboard**: `_______________________________`

## 🚨 Rollback Plan

If something goes wrong after deployment:

1. **In Vercel**: Deployments → Previous deployment → Promote to Production
2. **In Git**: `git revert HEAD` and push
3. **Emergency**: Pause project in Vercel settings

## 📧 Post-Launch

- [ ] **Share with initial users**: Get feedback
- [ ] **Monitor first 24 hours**: Watch for issues
- [ ] **Review feedback submissions**: Check Supabase
- [ ] **Plan next iteration**: Based on user feedback

## ✅ Deployment Complete!

Once all items are checked:

🎉 **Congratulations!** Your Manuscript Formatter is live at:

**`https://your-app.vercel.app`**

---

## Custom Domain (Optional - Later)

When you're ready to add a custom domain:

- [ ] Purchase domain from registrar
- [ ] Add domain in Vercel: Settings → Domains
- [ ] Update DNS records as instructed
- [ ] Wait for DNS propagation (up to 24 hours)
- [ ] Verify SSL certificate issued
- [ ] Test custom domain works

**Note**: This can be done anytime. Your `.vercel.app` domain works great!

---

**Need Help?**
- VERCEL_DEPLOYMENT.md - Detailed deployment guide
- SUPABASE_SETUP.md - Database configuration
- QUICK_START.md - General project guide
