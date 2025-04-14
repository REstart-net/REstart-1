/*
  # Add Referral Code Tracking

  1. New Tables
    - `referral_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `is_valid` (boolean)
      - `max_uses` (integer)
      - `current_uses` (integer)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
    
    - `user_referrals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `referral_code` (text)
      - `email` (text)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_valid boolean DEFAULT true,
  max_uses integer DEFAULT NULL,
  current_uses integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT NULL
);

-- Create user_referrals table
CREATE TABLE IF NOT EXISTS user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  referral_code text NOT NULL,
  email text NOT NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referral_codes
CREATE POLICY "Anyone can read valid referral codes"
  ON referral_codes
  FOR SELECT
  TO authenticated
  USING (is_valid = true);

-- Policies for user_referrals
CREATE POLICY "Users can view their own referrals"
  ON user_referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referrals"
  ON user_referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert some sample referral codes
INSERT INTO referral_codes (code, max_uses) VALUES
  ('NSAT2024', 1000),
  ('PREP10OFF', 200),
  ('NEWTONREF', 500)
ON CONFLICT (code) DO NOTHING; 