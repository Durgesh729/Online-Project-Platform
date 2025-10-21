-- SQL Migration for Enhanced Remark System
-- This script adds remark tracking and read status functionality
-- Run this in Supabase SQL Editor

-- Step 1: Ensure submissions table has remark column
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS remark TEXT,
ADD COLUMN IF NOT EXISTS remark_updated_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Create remark_reads table to track when mentees view remarks
CREATE TABLE IF NOT EXISTS public.remark_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, mentee_id)
);

-- Step 3: Enable RLS on remark_reads
ALTER TABLE public.remark_reads ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own remark reads" ON public.remark_reads;
DROP POLICY IF EXISTS "Users can mark remarks as read" ON public.remark_reads;
DROP POLICY IF EXISTS "Mentors can view remark reads" ON public.remark_reads;

-- Step 5: Create RLS policies for remark_reads
CREATE POLICY "Users can view their own remark reads" ON public.remark_reads
  FOR SELECT USING (mentee_id = auth.uid());

CREATE POLICY "Users can mark remarks as read" ON public.remark_reads
  FOR INSERT WITH CHECK (mentee_id = auth.uid());

CREATE POLICY "Mentors can view remark reads" ON public.remark_reads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.projects p ON s.project_id = p.id
      WHERE s.id = submission_id 
      AND p.mentor_id = auth.uid()
    )
  );

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_remark_reads_submission_id ON public.remark_reads(submission_id);
CREATE INDEX IF NOT EXISTS idx_remark_reads_mentee_id ON public.remark_reads(mentee_id);
CREATE INDEX IF NOT EXISTS idx_submissions_remark_updated_at ON public.submissions(remark_updated_at);

-- Step 7: Grant permissions
GRANT ALL ON public.remark_reads TO authenticated;

-- Step 8: Create a function to get unread remark count for a mentee
CREATE OR REPLACE FUNCTION get_unread_remarks_count(
  p_mentee_id UUID,
  p_project_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM public.submissions s
  WHERE s.mentee_id = p_mentee_id
    AND s.remark IS NOT NULL
    AND s.remark != ''
    AND (p_project_id IS NULL OR s.project_id = p_project_id)
    AND NOT EXISTS (
      SELECT 1 FROM public.remark_reads rr
      WHERE rr.submission_id = s.id
        AND rr.mentee_id = p_mentee_id
        AND rr.read_at >= s.remark_updated_at
    );
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create a function to check if a specific remark is unread
CREATE OR REPLACE FUNCTION is_remark_unread(
  p_submission_id UUID,
  p_mentee_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  has_remark BOOLEAN;
  is_unread BOOLEAN;
BEGIN
  -- Check if submission has a remark
  SELECT (remark IS NOT NULL AND remark != '')
  INTO has_remark
  FROM public.submissions
  WHERE id = p_submission_id;
  
  IF NOT has_remark THEN
    RETURN FALSE;
  END IF;
  
  -- Check if remark has been read
  SELECT NOT EXISTS (
    SELECT 1 FROM public.remark_reads rr
    JOIN public.submissions s ON rr.submission_id = s.id
    WHERE rr.submission_id = p_submission_id
      AND rr.mentee_id = p_mentee_id
      AND rr.read_at >= s.remark_updated_at
  )
  INTO is_unread;
  
  RETURN is_unread;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Update existing submissions to set remark_updated_at
UPDATE public.submissions
SET remark_updated_at = updated_at
WHERE remark IS NOT NULL 
  AND remark != ''
  AND remark_updated_at IS NULL;

-- Step 11: Create trigger to auto-update remark_updated_at when remark changes
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

-- Success message
SELECT 'Remark system schema created successfully!' as status;
