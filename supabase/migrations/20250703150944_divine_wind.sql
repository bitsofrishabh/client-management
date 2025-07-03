/*
  # Add height column to clients table

  1. Changes
    - Add height column to clients table (in cm)
    - Update existing clients with default height value

  2. Security
    - No changes to RLS policies needed
*/

-- Add height column to clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'height'
  ) THEN
    ALTER TABLE clients ADD COLUMN height integer;
  END IF;
END $$;

-- Set default height for existing clients (170 cm is average)
UPDATE clients 
SET height = 170 
WHERE height IS NULL;