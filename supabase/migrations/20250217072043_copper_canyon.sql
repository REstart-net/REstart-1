/*
  # Create Progress Tracking Tables

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subject` (text)
      - `completed_tests` (integer)
      - `total_score` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `completed_materials`
      - `id` (uuid, primary key)
      - `progress_id` (uuid, references user_progress)
      - `material_id` (text)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Add policies for authenticated users to update their own data
*/

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  completed_tests integer DEFAULT 0,
  total_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject)
);

-- Create completed_materials table
CREATE TABLE IF NOT EXISTS completed_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id uuid REFERENCES user_progress ON DELETE CASCADE,
  material_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(progress_id, material_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_materials ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for completed_materials
CREATE POLICY "Users can view own completed materials"
  ON completed_materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_progress
      WHERE user_progress.id = completed_materials.progress_id
      AND user_progress.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own completed materials"
  ON completed_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_progress
      WHERE user_progress.id = completed_materials.progress_id
      AND user_progress.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();