# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Manuscript Formatter app to store user feedback.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `manuscript-formatter` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for MVP
5. Click "Create new project"
6. Wait for the project to finish setting up (1-2 minutes)

## Step 2: Create the Feedback Table

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the following SQL:

```sql
-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  was_helpful BOOLEAN NOT NULL DEFAULT false,
  easy_to_use BOOLEAN NOT NULL DEFAULT false,
  formatting_accurate BOOLEAN NOT NULL DEFAULT false,
  would_recommend BOOLEAN NOT NULL DEFAULT false,
  additional_comments TEXT
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert feedback (anonymous submissions)
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Optional: Create a policy to allow reading feedback (for analytics)
CREATE POLICY "Anyone can read feedback"
  ON feedback
  FOR SELECT
  TO anon
  USING (true);

-- Create an index on created_at for faster queries
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
```

4. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
5. You should see "Success. No rows returned" - this is correct!

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"** under Project Settings
3. You'll see two important values:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

4. Copy these values - you'll need them in the next step

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in the root of your project
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file
4. **Restart your development server** for the changes to take effect:
   - Stop the server (Ctrl+C in the terminal)
   - Run `npm run dev` again

## Step 5: Test the Integration

1. Open your app at [http://localhost:3000](http://localhost:3000)
2. Upload a test .docx file
3. Download the formatted file
4. Fill out and submit the feedback form
5. Go back to Supabase dashboard → **Table Editor** → **feedback**
6. You should see your feedback entry!

## Verifying the Setup

### Check if environment variables are loaded:
```bash
# In your terminal
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Check the Supabase connection in browser console:
1. Open browser DevTools (F12)
2. Go to Console tab
3. If there are warnings about Supabase not being configured, check your `.env.local` file

## Optional: View Feedback Data

To view all submitted feedback:

1. Go to Supabase Dashboard
2. Click **"Table Editor"** in the left sidebar
3. Select the **"feedback"** table
4. You'll see all submitted feedback entries

### Query feedback with SQL:

```sql
-- Get all feedback
SELECT * FROM feedback ORDER BY created_at DESC;

-- Get feedback statistics
SELECT
  COUNT(*) as total_submissions,
  AVG(CASE WHEN was_helpful THEN 1 ELSE 0 END)::numeric(10,2) * 100 as helpful_percentage,
  AVG(CASE WHEN easy_to_use THEN 1 ELSE 0 END)::numeric(10,2) * 100 as easy_percentage,
  AVG(CASE WHEN formatting_accurate THEN 1 ELSE 0 END)::numeric(10,2) * 100 as accurate_percentage,
  AVG(CASE WHEN would_recommend THEN 1 ELSE 0 END)::numeric(10,2) * 100 as recommend_percentage
FROM feedback;

-- Get recent feedback with comments
SELECT created_at, additional_comments
FROM feedback
WHERE additional_comments IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

## Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **"Environment Variables"**
3. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

## Security Notes

- ✅ The `anon` key is safe to expose in client-side code
- ✅ Row Level Security (RLS) is enabled to protect the database
- ✅ The policy only allows INSERT operations (creating feedback)
- ✅ No sensitive user data is collected (anonymous feedback)
- ⚠️ Never commit `.env.local` to version control (it's in `.gitignore`)

## Troubleshooting

### "Failed to save feedback" error:
1. Check that environment variables are set correctly
2. Verify the feedback table exists in Supabase
3. Check RLS policies are enabled
4. Restart your dev server after changing `.env.local`

### Feedback not appearing in database:
1. Check browser console for errors
2. Verify network tab shows successful POST to `/api/feedback`
3. Check Supabase logs in Dashboard → Logs

### "Supabase environment variables are not set" warning:
1. Make sure `.env.local` exists and has correct values
2. Restart the development server
3. Check for typos in variable names

## Next Steps

After setup is complete:
- ✅ Test feedback submission end-to-end
- ✅ Monitor feedback in Supabase dashboard
- ✅ Deploy to Vercel with environment variables
- 📊 Set up analytics/reports for feedback data (optional)

---

**Need help?** Check the [Supabase Documentation](https://supabase.com/docs) or [Supabase Discord](https://discord.supabase.com/)
