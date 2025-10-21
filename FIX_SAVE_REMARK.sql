-- QUICK FIX: Save Remark Functionality
-- Run this in Supabase SQL Editor to fix the Save Remark issue

-- Step 1: Ensure remark column exists in submissions table
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS remark TEXT,
ADD COLUMN IF NOT EXISTS remark_updated_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Check and fix RLS policies for submissions table
-- Drop any restrictive policies that might block mentor updates
DROP POLICY IF EXISTS "Mentors can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow mentors to update remarks" ON public.submissions;

-- Step 3: Create a policy that allows mentors to update submissions (including remarks)
-- This allows mentors to update submissions for their projects
CREATE POLICY "Mentors can update project submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = submissions.project_id
      AND p.mentor_id = auth.uid()
    )
  );

-- Alternative: If mentor_id is not on projects, try mentor_email match
-- Uncomment if needed:
-- DROP POLICY IF EXISTS "Mentors can update project submissions" ON public.submissions;
-- CREATE POLICY "Mentors can update project submissions" ON public.submissions
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM public.projects p
--       JOIN public.users u ON u.email = p.mentor_email
--       WHERE p.id = submissions.project_id
--       AND u.id = auth.uid()
--     )
--   );

-- Step 4: Create trigger to auto-update timestamp
CREATE OR REPLACE FUNCTION update_remark_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.remark IS DISTINCT FROM OLD.remark THEN
    NEW.remark_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_remark_timestamp ON public.submissions;
CREATE TRIGGER trigger_update_remark_timestamp
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_remark_timestamp();

-- Step 5: Verify the changes
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'submissions' 
  AND column_name IN ('remark', 'remark_updated_at');

-- Step 6: Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'submissions';

-- Success message
SELECT 'Save Remark fix applied! Please test in the Mentor Dashboard.' as status;
