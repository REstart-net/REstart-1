/*
  # Test Questions Management System

  1. New Tables
    - `question_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `question_tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)

    - `questions`
      - `id` (uuid, primary key)
      - `text` (text)
      - `type` (text)
      - `options` (jsonb)
      - `correct_answer` (text)
      - `difficulty` (integer)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `version` (integer)
      - `is_active` (boolean)

    - `question_tags_map`
      - `question_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)

    - `question_usage_stats`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `times_used` (integer)
      - `times_correct` (integer)
      - `last_used` (timestamp)
      - `average_time_spent` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum for question types
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');

-- Create question categories table
CREATE TABLE IF NOT EXISTS question_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create question tags table
CREATE TABLE IF NOT EXISTS question_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  type question_type NOT NULL,
  options jsonb,
  correct_answer text NOT NULL,
  difficulty integer CHECK (difficulty BETWEEN 1 AND 5),
  category_id uuid REFERENCES question_categories ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Create question tags mapping table
CREATE TABLE IF NOT EXISTS question_tags_map (
  question_id uuid REFERENCES questions ON DELETE CASCADE,
  tag_id uuid REFERENCES question_tags ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- Create question usage statistics table
CREATE TABLE IF NOT EXISTS question_usage_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions ON DELETE CASCADE,
  times_used integer DEFAULT 0,
  times_correct integer DEFAULT 0,
  last_used timestamptz,
  average_time_spent integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_usage_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for question categories
CREATE POLICY "Anyone can view question categories"
  ON question_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert question categories"
  ON question_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update question categories"
  ON question_categories
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policies for question tags
CREATE POLICY "Anyone can view question tags"
  ON question_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage tags"
  ON question_tags
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policies for questions
CREATE POLICY "Anyone can view active questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view their own questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create policies for question tags mapping
CREATE POLICY "Anyone can view question tags mapping"
  ON question_tags_map
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their question tags"
  ON question_tags_map
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM questions
      WHERE questions.id = question_tags_map.question_id
      AND questions.created_by = auth.uid()
    )
  );

-- Create policies for question usage stats
CREATE POLICY "Anyone can view question usage stats"
  ON question_usage_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can update usage stats"
  ON question_usage_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_question_categories_updated_at
  BEFORE UPDATE ON question_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_question_tags_map_question ON question_tags_map(question_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_map_tag ON question_tags_map(tag_id);