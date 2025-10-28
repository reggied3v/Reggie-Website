# Vercel Deployment Guide

Deploy your Manuscript Formatter to Vercel in minutes - **no custom domain required!**

## ✅ What You'll Get

- **Free Vercel subdomain**: `manuscript-formatter.vercel.app` (or similar)
- **Automatic HTTPS**: Secure by default
- **Global CDN**: Fast worldwide
- **Auto-deployments**: Every push to main branch
- **Free tier**: Perfect for MVP

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ Code working locally (http://localhost:3000)
- ✅ Supabase project created and configured
- ✅ Git repository (local or GitHub)
- ✅ Vercel account (free)

## 🚀 Deployment Steps

### Step 1: Initialize Git Repository (if not already done)

```bash
cd /Users/ReggieD3V/Desktop/Applications/manuscript-formatter

# Initialize git (if needed)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Manuscript Formatter MVP"
```

### Step 2: Push to GitHub

#### Option A: Create New Repository on GitHub

1. Go to https://github.com/new
2. Create repository named `manuscript-formatter`
3. **DO NOT** initialize with README (you already have code)
4. Click "Create repository"

#### Option B: Use Existing Repository

If you already have a repository, just push to it.

#### Push Your Code

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/manuscript-formatter.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### A. Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Sign up with GitHub (easiest option)
3. Authorize Vercel to access your repositories

#### B. Import Your Project

1. Click "Add New" → "Project"
2. Find `manuscript-formatter` in your repository list
3. Click "Import"

#### C. Configure Project Settings

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

**Install Command**: `npm install` (default)

#### D. Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Where to get these:**
- Go to your Supabase project
- Settings → API
- Copy "Project URL" and "anon public" key

#### E. Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://manuscript-formatter.vercel.app`

## 🎉 Your App is Live!

Visit your Vercel URL and test:

1. Upload test document
2. Download formatted file
3. Submit feedback
4. Verify feedback saves to Supabase

## 🔄 Automatic Deployments

Every time you push to GitHub, Vercel will automatically:

1. Build your app
2. Run tests (if configured)
3. Deploy to production
4. Update your live URL

```bash
# Make a change
# Commit and push
git add .
git commit -m "Update formatting logic"
git push

# Vercel automatically deploys! 🚀
```

## 📱 Custom Domain (Optional - Can Be Added Later)

If you want a custom domain like `manuscriptformatter.com`:

1. Buy domain from registrar (Namecheap, GoDaddy, etc.)
2. In Vercel project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation (~24 hours)

**Note**: This is completely optional! Your `.vercel.app` domain works perfectly.

## 🔧 Post-Deployment Configuration

### Monitor Your App

**Vercel Dashboard**:
- View deployment logs
- Monitor analytics
- Check build status
- View error logs

**Supabase Dashboard**:
- Check feedback submissions
- Monitor database usage
- View API requests

### Update Environment Variables

If you need to change Supabase credentials:

1. Vercel project → Settings → Environment Variables
2. Edit the variable
3. Redeploy (Deployments → Click three dots → Redeploy)

## 🐛 Troubleshooting

### Build Fails

**Error**: "Type errors in TypeScript"
```bash
# Check locally first
npx tsc --noEmit
# Fix any errors, then commit and push
```

**Error**: "Module not found"
```bash
# Make sure package.json is committed
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
```

### App Deployed But Not Working

**Check 1**: Environment variables set correctly?
- Vercel → Settings → Environment Variables
- Must start with `NEXT_PUBLIC_` for client-side access

**Check 2**: Supabase RLS policies enabled?
- See SUPABASE_SETUP.md
- Verify policies allow INSERT on feedback table

**Check 3**: View deployment logs
- Vercel Dashboard → Deployments → Click deployment → View Function Logs

### Feedback Not Saving

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify Supabase credentials in Vercel

## 📊 Vercel Free Tier Limits

Your app should stay well within free limits:

- ✅ **Bandwidth**: 100 GB/month (plenty for MVP)
- ✅ **Build time**: 6000 minutes/month
- ✅ **Serverless Functions**: 100 GB-hours/month
- ✅ **Deployments**: Unlimited

## 🔐 Security Checklist

Before going live:

- ✅ `.env.local` in `.gitignore` (already done)
- ✅ Supabase RLS policies enabled (see SUPABASE_SETUP.md)
- ✅ Environment variables in Vercel (not in code)
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ No API keys in client-side code

## 📈 Next Steps After Deployment

1. **Test thoroughly**: Upload various documents
2. **Share with friends**: Get initial feedback
3. **Monitor Supabase**: Watch for submissions
4. **Check Vercel analytics**: See usage patterns
5. **Iterate**: Add features based on feedback

## 🎯 Deployment Checklist

Use this checklist when deploying:

- [ ] Code tested locally
- [ ] Supabase configured and working
- [ ] Git repository initialized
- [ ] Pushed to GitHub
- [ ] Signed up for Vercel
- [ ] Imported project to Vercel
- [ ] Added environment variables
- [ ] Deployed successfully
- [ ] Tested live URL
- [ ] Feedback saving to Supabase
- [ ] Shared URL with test users

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Supabase + Vercel**: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

## 🎊 Congratulations!

Your Manuscript Formatter is now live and accessible to anyone with the link!

**Your URL**: `https://manuscript-formatter-XXXXX.vercel.app`

(The exact URL will be shown after deployment)

---

**Remember**: Custom domain is optional and can be added anytime. Your `.vercel.app` URL works perfectly for MVP and beyond!
