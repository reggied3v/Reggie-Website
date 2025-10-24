-- Create assessments table for storing Agile Assessment submissions
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Part 1: Team Context
  team_setup TEXT NOT NULL,
  team_maturity INTEGER NOT NULL CHECK (team_maturity >= 1 AND team_maturity <= 5),
  current_tools TEXT[] DEFAULT '{}',
  current_tools_other TEXT,
  team_distribution TEXT NOT NULL,
  current_events TEXT[] DEFAULT '{}',
  current_events_other TEXT,

  -- Part 2: Stakeholder & Success
  stakeholder_commitment INTEGER NOT NULL CHECK (stakeholder_commitment >= 1 AND stakeholder_commitment <= 5),
  po_availability TEXT NOT NULL,
  po_availability_other TEXT,
  success_definition TEXT NOT NULL,
  current_metrics TEXT[] DEFAULT '{}',
  current_metrics_other TEXT,

  -- Part 3: Pain Points & Improvement
  biggest_challenge TEXT NOT NULL,
  biggest_challenge_other TEXT,
  work_challenges JSONB NOT NULL, -- {discoveryVsExecution, backlogClarity, unexpectedBlockers}
  transparency_scores JSONB NOT NULL, -- {teamAwareness, openDiscussion, stakeholderVisibility}
  team_dynamics TEXT[] DEFAULT '{}',
  automation_usage TEXT[] DEFAULT '{}',
  automation_usage_other TEXT,
  improvement_goals TEXT NOT NULL,

  -- Part 4: Contact & Context
  role TEXT NOT NULL,
  role_other TEXT,
  organization_context TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_team TEXT,
  opted_in_communications BOOLEAN DEFAULT FALSE,

  -- Metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,

  -- Calculated fields (will be populated by API/trigger)
  overall_score INTEGER,
  maturity_level TEXT,

  -- Status tracking
  results_sent BOOLEAN DEFAULT FALSE,
  results_sent_at TIMESTAMPTZ,
  pdf_generated BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,

  -- Indexes for common queries
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_email ON public.assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_organization ON public.assessments(organization_context);
CREATE INDEX IF NOT EXISTS idx_assessments_role ON public.assessments(role);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can insert (public assessment form)
CREATE POLICY "Anyone can submit assessments"
  ON public.assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy: Only authenticated users (admin) can read all assessments
CREATE POLICY "Authenticated users can read assessments"
  ON public.assessments
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy: Users can read their own assessment by email
CREATE POLICY "Users can read their own assessments"
  ON public.assessments
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Grant permissions
GRANT INSERT ON public.assessments TO anon;
GRANT SELECT ON public.assessments TO authenticated;

-- Create a view for analytics (aggregated, anonymized data)
CREATE OR REPLACE VIEW public.assessment_analytics AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  team_setup,
  team_maturity,
  team_distribution,
  role,
  organization_context,
  stakeholder_commitment,
  po_availability,
  biggest_challenge,
  overall_score,
  maturity_level,
  COUNT(*) as count
FROM public.assessments
GROUP BY
  DATE_TRUNC('day', created_at),
  team_setup,
  team_maturity,
  team_distribution,
  role,
  organization_context,
  stakeholder_commitment,
  po_availability,
  biggest_challenge,
  overall_score,
  maturity_level;

-- Grant access to analytics view
GRANT SELECT ON public.assessment_analytics TO authenticated;

-- Add comment to table
COMMENT ON TABLE public.assessments IS 'Stores Agile Assessment submissions from reggieragsdale.com';
