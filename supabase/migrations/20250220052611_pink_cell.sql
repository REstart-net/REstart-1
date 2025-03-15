/*
  # Fix Remaining Database Issues

  1. Changes
    - Add increment_question_usage function
    - Update RLS policies for completed_materials
    - Fix total_score data type
    - Add question usage tracking functions

  2. Security
    - Update RLS policies to properly handle upserts
    - Add proper function security
*/

-- Update user_progress to use double precision for total_score
ALTER TABLE user_progress 
  ALTER COLUMN total_score TYPE double precision;

-- Create question usage tracking function
CREATE OR REPLACE FUNCTION increment_question_usage(question_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create usage stats records if they don't exist
  INSERT INTO question_usage_stats (question_id)
  SELECT UNNEST(question_ids)
  ON CONFLICT (question_id) DO NOTHING;

  -- Update usage statistics
  UPDATE question_usage_stats
  SET 
    times_used = times_used + 1,
    last_used = now()
  WHERE question_id = ANY(question_ids);
END;
$$;

-- Create function to update question stats
CREATE OR REPLACE FUNCTION update_question_stats(
  p_question_id uuid,
  p_correct boolean,
  p_time_spent integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create or update stats
  INSERT INTO question_usage_stats (
    question_id,
    times_used,
    times_correct,
    average_time_spent
  )
  VALUES (
    p_question_id,
    1,
    CASE WHEN p_correct THEN 1 ELSE 0 END,
    p_time_spent
  )
  ON CONFLICT (question_id) DO UPDATE
  SET
    times_correct = question_usage_stats.times_correct + CASE WHEN p_correct THEN 1 ELSE 0 END,
    average_time_spent = (
      (question_usage_stats.average_time_spent * question_usage_stats.times_used + p_time_spent) /
      (question_usage_stats.times_used + 1)
    ),
    times_used = question_usage_stats.times_used + 1,
    last_used = now();
END;
$$;

-- Drop existing RLS policies for completed_materials
DROP POLICY IF EXISTS "Users can view own completed materials" ON completed_materials;
DROP POLICY IF EXISTS "Users can insert own completed materials" ON completed_materials;

-- Create updated RLS policies for completed_materials
CREATE POLICY "Users can manage own completed materials"
  ON completed_materials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_progress
      WHERE user_progress.id = completed_materials.progress_id
      AND user_progress.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_progress
      WHERE user_progress.id = completed_materials.progress_id
      AND user_progress.user_id = auth.uid()
    )
  );