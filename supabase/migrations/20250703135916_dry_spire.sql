/*
  # Create clients management schema

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `start_date` (date)
      - `start_weight` (decimal)
      - `current_weight` (decimal)
      - `goal_weight` (decimal)
      - `status` (text)
      - `notes` (text)
      - `health_issues` (text array)
      - `diet_end_date` (date)
      - `routine` (text)
      - `health_summary` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weight_entries`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `date` (date)
      - `weight` (decimal)
      - `created_at` (timestamp)
    
    - `client_comments`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `text` (text)
      - `author` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage client data
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  start_date date NOT NULL,
  start_weight decimal(5,2) DEFAULT 0,
  current_weight decimal(5,2) DEFAULT 0,
  goal_weight decimal(5,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'yet-to-start', 'completed')),
  notes text DEFAULT '',
  health_issues text[] DEFAULT '{}',
  diet_end_date date,
  routine text DEFAULT '',
  health_summary text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weight_entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  date date NOT NULL,
  weight decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create client_comments table
CREATE TABLE IF NOT EXISTS client_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  text text NOT NULL,
  author text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weight_entries_client_id ON weight_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON weight_entries(date);
CREATE INDEX IF NOT EXISTS idx_client_comments_client_id ON client_comments(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Authenticated users can read clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for weight_entries table
CREATE POLICY "Authenticated users can read weight entries"
  ON weight_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert weight entries"
  ON weight_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update weight entries"
  ON weight_entries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete weight entries"
  ON weight_entries
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for client_comments table
CREATE POLICY "Authenticated users can read comments"
  ON client_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON client_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON client_comments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete comments"
  ON client_comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();