/*
  # Fix empty diet end dates

  1. Data Cleanup
    - Update any empty string diet_end_date values to NULL
    - This resolves the PostgreSQL date validation error

  2. Changes
    - Convert empty strings ('') in diet_end_date column to NULL
    - This prevents "invalid input syntax for type date" errors
*/

-- Update empty string diet_end_date values to NULL
UPDATE clients 
SET diet_end_date = NULL 
WHERE diet_end_date = '';