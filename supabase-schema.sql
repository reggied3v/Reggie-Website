-- =============================================
-- Reggie's Personal Website - Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING TABLES (if they exist)
-- =============================================
DROP TABLE IF EXISTS podcasts CASCADE;
DROP TABLE IF EXISTS audiobooks CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- =============================================
-- CONTACTS TABLE
-- Store contact form submissions
-- =============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_is_read ON contacts(is_read);

-- =============================================
-- BLOG POSTS TABLE
-- Store blog posts and articles
-- =============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time TEXT,
  cover_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);

-- =============================================
-- ANALYTICS TABLE
-- Track page views and visitor statistics
-- =============================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_page_path ON analytics(page_path);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);

-- =============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- Store email subscribers for blog updates
-- =============================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Index for email lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active);

-- =============================================
-- PODCASTS TABLE
-- Store recent podcasts listened to
-- =============================================
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  host TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  spotify_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for podcasts
CREATE INDEX idx_podcasts_featured ON podcasts(is_featured, display_order);
CREATE INDEX idx_podcasts_order ON podcasts(display_order);

-- =============================================
-- AUDIOBOOKS TABLE
-- Store recent audiobooks listened to
-- =============================================
CREATE TABLE audiobooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  spotify_url TEXT,
  audible_url TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audiobooks
CREATE INDEX idx_audiobooks_featured ON audiobooks(is_featured, display_order);
CREATE INDEX idx_audiobooks_order ON audiobooks(display_order);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audiobooks_updated_at
  BEFORE UPDATE ON audiobooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiobooks ENABLE ROW LEVEL SECURITY;

-- Contacts: Public can insert, admins can read/update
CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true);

-- Blog Posts: Public can read published, admins can do everything
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Analytics: Public can insert, admins can read
CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (true);

-- Newsletter: Public can subscribe, admins can manage
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true);

-- Podcasts: Public can read featured, admins can do everything
CREATE POLICY "Anyone can view featured podcasts"
  ON podcasts FOR SELECT
  TO public
  USING (is_featured = true);

CREATE POLICY "Authenticated users can view all podcasts"
  ON podcasts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert podcasts"
  ON podcasts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update podcasts"
  ON podcasts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete podcasts"
  ON podcasts FOR DELETE
  TO authenticated
  USING (true);

-- Audiobooks: Public can read featured, admins can do everything
CREATE POLICY "Anyone can view featured audiobooks"
  ON audiobooks FOR SELECT
  TO public
  USING (is_featured = true);

CREATE POLICY "Authenticated users can view all audiobooks"
  ON audiobooks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audiobooks"
  ON audiobooks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update audiobooks"
  ON audiobooks FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete audiobooks"
  ON audiobooks FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample blog categories
COMMENT ON COLUMN blog_posts.category IS 'Categories: Tutorial, Design, Development, Performance, React, etc.';
