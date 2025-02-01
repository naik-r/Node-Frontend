/*
  # Initial Schema Setup

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `website_url` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `webpages`
      - `id` (uuid, primary key)
      - `url` (text)
      - `status` (text)
      - `meta_description` (text)
      - `org_id` (uuid, references organizations)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website_url text NOT NULL,
  description text,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create webpages table
CREATE TABLE webpages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  status text NOT NULL CHECK (status IN ('scraped', 'in_progress', 'pending')),
  meta_description text,
  org_id uuid NOT NULL REFERENCES organizations(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webpages ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Users can manage their own organizations"
  ON organizations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for webpages
CREATE POLICY "Users can manage webpages for their organizations"
  ON webpages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = webpages.org_id
      AND organizations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = webpages.org_id
      AND organizations.user_id = auth.uid()
    )
  );