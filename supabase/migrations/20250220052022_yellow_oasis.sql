/*
  # Fix Database Issues and Add Initial Data

  1. Changes
    - Drop and recreate completed_materials table with proper constraints
    - Add initial question categories
    - Add sample questions for each category
    - Fix unique constraints

  2. Initial Data
    - Question categories for all subjects
    - Sample questions for testing
*/

-- Recreate completed_materials table with proper constraints
DROP TABLE IF EXISTS completed_materials;
CREATE TABLE completed_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id uuid REFERENCES user_progress ON DELETE CASCADE,
  material_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(progress_id, material_id)
);

-- Enable RLS on completed_materials
ALTER TABLE completed_materials ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for completed_materials
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

-- Insert initial categories if they don't exist
INSERT INTO question_categories (name, description)
VALUES
  ('Basic Mathematics', 'Fundamental mathematical concepts including arithmetic, basic algebra, and geometry'),
  ('Advanced Mathematics', 'Advanced topics including calculus, trigonometry, and complex algebra'),
  ('English', 'English language proficiency including grammar, vocabulary, and comprehension'),
  ('Logical Reasoning', 'Critical thinking, analytical reasoning, and problem-solving skills')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

-- Insert sample questions for each category
DO $$
DECLARE
  basic_math_id uuid;
  advanced_math_id uuid;
  english_id uuid;
  logical_id uuid;
  admin_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO basic_math_id FROM question_categories WHERE name = 'Basic Mathematics';
  SELECT id INTO advanced_math_id FROM question_categories WHERE name = 'Advanced Mathematics';
  SELECT id INTO english_id FROM question_categories WHERE name = 'English';
  SELECT id INTO logical_id FROM question_categories WHERE name = 'Logical Reasoning';
  
  -- Get first admin user or create one if none exists
  SELECT id INTO admin_id FROM auth.users LIMIT 1;
  
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
  END IF;

  -- Insert sample questions for Basic Mathematics
  INSERT INTO questions (text, type, options, correct_answer, difficulty, category_id, created_by, is_active)
  VALUES
    (
      'What is 15 + 27?',
      'multiple_choice',
      '["40", "42", "43", "44"]',
      '1',
      1,
      basic_math_id,
      admin_id,
      true
    ),
    (
      'Solve for x: 2x + 5 = 13',
      'multiple_choice',
      '["3", "4", "5", "6"]',
      '1',
      2,
      basic_math_id,
      admin_id,
      true
    ),
    (
      'What is the area of a rectangle with length 8 and width 6?',
      'multiple_choice',
      '["42", "46", "48", "50"]',
      '2',
      1,
      basic_math_id,
      admin_id,
      true
    )
  ON CONFLICT DO NOTHING;

  -- Insert sample questions for Advanced Mathematics
  INSERT INTO questions (text, type, options, correct_answer, difficulty, category_id, created_by, is_active)
  VALUES
    (
      'What is the derivative of x²?',
      'multiple_choice',
      '["x", "2x", "2", "x²"]',
      '1',
      3,
      advanced_math_id,
      admin_id,
      true
    ),
    (
      'Solve: sin²θ + cos²θ = ?',
      'multiple_choice',
      '["0", "1", "2", "π"]',
      '1',
      3,
      advanced_math_id,
      admin_id,
      true
    ),
    (
      'What is the value of log₁₀(100)?',
      'multiple_choice',
      '["1", "2", "10", "100"]',
      '1',
      2,
      advanced_math_id,
      admin_id,
      true
    )
  ON CONFLICT DO NOTHING;

  -- Insert sample questions for English
  INSERT INTO questions (text, type, options, correct_answer, difficulty, category_id, created_by, is_active)
  VALUES
    (
      'Choose the correct form: "She ___ to the store yesterday."',
      'multiple_choice',
      '["go", "goes", "went", "gone"]',
      '2',
      1,
      english_id,
      admin_id,
      true
    ),
    (
      'Which word is a synonym for "happy"?',
      'multiple_choice',
      '["sad", "joyful", "angry", "tired"]',
      '1',
      1,
      english_id,
      admin_id,
      true
    ),
    (
      'Identify the correct spelling:',
      'multiple_choice',
      '["recieve", "receive", "receeve", "receve"]',
      '1',
      2,
      english_id,
      admin_id,
      true
    )
  ON CONFLICT DO NOTHING;

  -- Insert sample questions for Logical Reasoning
  INSERT INTO questions (text, type, options, correct_answer, difficulty, category_id, created_by, is_active)
  VALUES
    (
      'If all A are B, and all B are C, then:',
      'multiple_choice',
      '["All A are C", "No A are C", "Some A are C", "Cannot determine"]',
      '0',
      2,
      logical_id,
      admin_id,
      true
    ),
    (
      'Which number comes next in the sequence: 2, 4, 8, 16, __?',
      'multiple_choice',
      '["24", "32", "64", "128"]',
      '1',
      2,
      logical_id,
      admin_id,
      true
    ),
    (
      'If RED is coded as 27, then BLUE is coded as:',
      'multiple_choice',
      '["36", "37", "38", "39"]',
      '2',
      3,
      logical_id,
      admin_id,
      true
    )
  ON CONFLICT DO NOTHING;
END $$;