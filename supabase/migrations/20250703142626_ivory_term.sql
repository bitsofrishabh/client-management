/*
  # Fix empty diet_end_date values

  1. Problem
    - Some diet_end_date values contain empty strings which are invalid for PostgreSQL date type
    - This causes "invalid input syntax for type date" errors

  2. Solution
    - Use string comparison to identify empty values before converting to NULL
    - Cast the column to text for comparison to avoid date parsing errors
*/

-- Update empty string diet_end_date values to NULL
-- Cast to text to avoid date parsing during comparison
UPDATE clients 
SET diet_end_date = NULL 
WHERE diet_end_date::text = '';

-- Also handle any whitespace-only values
UPDATE clients 
SET diet_end_date = NULL 
WHERE trim(diet_end_date::text) = '';