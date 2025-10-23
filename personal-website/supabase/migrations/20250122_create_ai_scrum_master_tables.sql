-- AI Scrum Master Platform Database Schema

-- Teams table: Represents Scrum teams using the platform
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Team information
  name TEXT NOT NULL,
  description TEXT,
  team_size INTEGER CHECK (team_size > 0),

  -- Settings
  timezone TEXT DEFAULT 'UTC',
  anonymization_enabled BOOLEAN DEFAULT true,

  -- Ownership (links to auth.users)
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Subscription/billing info
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days')
);

-- Team members table: Links users to teams
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),

  UNIQUE(team_id, user_id)
);

-- Meetings table: Individual meeting sessions
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,

  -- Meeting metadata
  meeting_type TEXT NOT NULL CHECK (meeting_type IN (
    'standup', 'planning', 'review', 'retrospective', 'refinement', 'other'
  )),
  meeting_date DATE NOT NULL,
  duration_minutes INTEGER CHECK (duration_minutes > 0),

  -- Transcript data
  transcript_text TEXT NOT NULL,
  transcript_source TEXT, -- e.g., 'zoom', 'teams', 'manual'

  -- Analysis status
  analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN (
    'pending', 'processing', 'completed', 'failed'
  )),
  analyzed_at TIMESTAMPTZ,

  -- AI-generated insights (JSONB for flexibility)
  insights JSONB,

  -- Scores (0-100)
  overall_health_score INTEGER CHECK (overall_health_score >= 0 AND overall_health_score <= 100),
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  transparency_score INTEGER CHECK (transparency_score >= 0 AND transparency_score <= 100),
  collaboration_score INTEGER CHECK (collaboration_score >= 0 AND collaboration_score <= 100),

  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(transcript_text, ''))
  ) STORED
);

-- Action items table: Extracted from meetings
CREATE TABLE IF NOT EXISTS public.action_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,

  -- Action item details
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT, -- Could be anonymized name or identifier

  -- Status tracking
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Priority
  priority TEXT CHECK (priority IN ('low', 'medium', 'high'))
);

-- Patterns table: Long-term patterns detected across meetings
CREATE TABLE IF NOT EXISTS public.patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,

  -- Pattern information
  pattern_type TEXT NOT NULL CHECK (pattern_type IN (
    'recurring_blocker', 'communication_gap', 'positive_trend', 'negative_trend',
    'team_dynamic', 'process_issue', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Pattern metadata
  first_detected_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),

  -- Pattern is active/resolved
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'resolved', 'dismissed')),
  resolved_at TIMESTAMPTZ
);

-- Coaching suggestions table: AI-generated coaching recommendations
CREATE TABLE IF NOT EXISTS public.coaching_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
  pattern_id UUID REFERENCES public.patterns(id) ON DELETE SET NULL,

  -- Suggestion details
  category TEXT NOT NULL CHECK (category IN (
    'facilitation', 'team_dynamics', 'process', 'communication', 'agile_practice', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_steps TEXT[], -- Array of specific actions to take

  -- Suggestion metadata
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'dismissed')),

  -- Tracking
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  feedback TEXT -- User feedback on the suggestion
);

-- Team health snapshots: Weekly/sprint aggregated metrics
CREATE TABLE IF NOT EXISTS public.team_health_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,

  -- Time period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT DEFAULT 'week' CHECK (period_type IN ('week', 'sprint', 'month')),

  -- Aggregated scores
  avg_health_score INTEGER CHECK (avg_health_score >= 0 AND avg_health_score <= 100),
  avg_engagement_score INTEGER CHECK (avg_engagement_score >= 0 AND avg_engagement_score <= 100),
  avg_transparency_score INTEGER CHECK (avg_transparency_score >= 0 AND avg_transparency_score <= 100),
  avg_collaboration_score INTEGER CHECK (avg_collaboration_score >= 0 AND avg_collaboration_score <= 100),

  -- Meeting counts
  meetings_count INTEGER DEFAULT 0,

  -- Action items tracking
  action_items_created INTEGER DEFAULT 0,
  action_items_completed INTEGER DEFAULT 0,

  -- Trends
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),

  UNIQUE(team_id, period_start, period_end)
);

-- Create indexes for better query performance
CREATE INDEX idx_meetings_team_id ON public.meetings(team_id);
CREATE INDEX idx_meetings_meeting_date ON public.meetings(meeting_date DESC);
CREATE INDEX idx_meetings_analysis_status ON public.meetings(analysis_status);
CREATE INDEX idx_meetings_search_vector ON public.meetings USING GIN(search_vector);
CREATE INDEX idx_action_items_team_id ON public.action_items(team_id);
CREATE INDEX idx_action_items_status ON public.action_items(status);
CREATE INDEX idx_patterns_team_id ON public.patterns(team_id);
CREATE INDEX idx_patterns_status ON public.patterns(status);
CREATE INDEX idx_coaching_suggestions_team_id ON public.coaching_suggestions(team_id);
CREATE INDEX idx_team_health_snapshots_team_id ON public.team_health_snapshots(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_health_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Teams
CREATE POLICY "Users can view teams they are members of"
ON public.teams FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create teams"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Team owners can update their teams"
ON public.teams FOR UPDATE
TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Team owners can delete their teams"
ON public.teams FOR DELETE
TO authenticated
USING (owner_user_id = auth.uid());

-- RLS Policies for Team Members
CREATE POLICY "Users can view members of their teams"
ON public.team_members FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Team owners and admins can add members"
ON public.team_members FOR INSERT
TO authenticated
WITH CHECK (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- RLS Policies for Meetings (similar pattern for other tables)
CREATE POLICY "Users can view meetings of their teams"
ON public.meetings FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Team members can create meetings"
ON public.meetings FOR INSERT
TO authenticated
WITH CHECK (
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ) AND uploaded_by = auth.uid()
);

CREATE POLICY "Team members can update meetings"
ON public.meetings FOR UPDATE
TO authenticated
USING (
  team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  )
);

-- Service role policies (for API operations)
CREATE POLICY "Service role full access teams"
ON public.teams FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access meetings"
ON public.meetings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access action_items"
ON public.action_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access patterns"
ON public.patterns FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role full access coaching"
ON public.coaching_suggestions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.meetings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.action_items TO authenticated;
GRANT SELECT ON public.patterns TO authenticated;
GRANT SELECT, UPDATE ON public.coaching_suggestions TO authenticated;
GRANT SELECT ON public.team_health_snapshots TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON public.patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_suggestions_updated_at BEFORE UPDATE ON public.coaching_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
