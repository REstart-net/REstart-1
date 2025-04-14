/*
  # Add Test Attempts Tracking

  1. New Tables
    - `user_test_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subject` (text)
      - `test_id` (text)
      - `score` (double precision)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to read their own data
    - Add policies for authenticated users to insert their own data
*/

-- Create user_test_attempts table
CREATE TABLE IF NOT EXISTS user_test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  test_id text NOT NULL,
  score double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject, test_id)
);

-- Enable RLS
ALTER TABLE user_test_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for user_test_attempts
CREATE POLICY "Users can view own test attempts"
  ON user_test_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test attempts"
  ON user_test_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id); 