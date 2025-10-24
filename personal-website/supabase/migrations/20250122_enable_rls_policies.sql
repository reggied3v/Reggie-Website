-- Re-enable Row Level Security on assessments table
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can submit assessments" ON public.assessments;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can read assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can read their own assessments" ON public.assessments;

-- Policy 1: Allow service role to do everything (for API routes)
CREATE POLICY "Service role has full access"
ON public.assessments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Allow authenticated admin users to read all assessments
CREATE POLICY "Admins can read all assessments"
ON public.assessments
FOR SELECT
TO authenticated
USING (
  -- Check if user has admin role (you can customize this)
  auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy 3: Users can read their own assessment by email (for viewing results)
CREATE POLICY "Users can read their own assessment"
ON public.assessments
FOR SELECT
TO anon, authenticated
USING (
  email = current_setting('request.jwt.claim.email', true)
  OR
  email = (auth.jwt() ->> 'email')
);

-- Note: We don't need an INSERT policy for anon users because
-- the API route will use the service role key to insert data

-- Grant necessary permissions
GRANT SELECT ON public.assessments TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Ensure the analytics view has proper access
GRANT SELECT ON public.assessment_analytics TO authenticated;

-- Add helpful comments
COMMENT ON POLICY "Service role has full access" ON public.assessments IS
  'Allows API routes using service_role key to insert/update assessments';

COMMENT ON POLICY "Admins can read all assessments" ON public.assessments IS
  'Allows admin users to view all assessment submissions';

COMMENT ON POLICY "Users can read their own assessment" ON public.assessments IS
  'Allows users to view their own assessment results by email';
