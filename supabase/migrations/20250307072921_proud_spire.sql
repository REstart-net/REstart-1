/*
  # Add unique constraint to question_usage_stats table

  1. Changes
    - Add unique constraint on question_id column in question_usage_stats table
    - This enables upsert operations using ON CONFLICT

  2. Security
    - No security changes required
    - Existing RLS policies remain in place
*/

-- Add unique constraint to question_usage_stats table
ALTER TABLE question_usage_stats 
ADD CONSTRAINT question_usage_stats_question_id_key 
UNIQUE (question_id);