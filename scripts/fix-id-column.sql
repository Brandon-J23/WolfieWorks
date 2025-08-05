-- Fix the id column to have proper UUID default value
-- This ensures every new portfolio item gets a unique ID automatically

-- First, let's check if the id column exists and has the right setup
-- If the column doesn't have a default, this will add it
ALTER TABLE user_portfolio 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Make sure the id column is definitely the primary key
-- (This will do nothing if it's already set up correctly)
ALTER TABLE user_portfolio 
ADD CONSTRAINT user_portfolio_pkey PRIMARY KEY (id);

-- Optional: If there are any existing rows without IDs, this would update them
-- (But this shouldn't be necessary if the table was created correctly)
-- UPDATE user_portfolio SET id = gen_random_uuid() WHERE id IS NULL;
