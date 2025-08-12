-- Modify the existing user_portfolio table to match our portfolio needs
-- This script will add missing columns and ensure the table structure matches our code

-- Add missing columns
ALTER TABLE user_portfolio 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS file_url VARCHAR(1024),
ADD COLUMN IF NOT EXISTS project_url VARCHAR(1024),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Rename is_featured to featured to match our code
ALTER TABLE user_portfolio 
RENAME COLUMN is_featured TO featured;

-- If url column exists and you want to use it as project_url, you can copy the data
-- UPDATE user_portfolio SET project_url = url WHERE url IS NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_portfolio_user_id_idx ON user_portfolio(user_id);
CREATE INDEX IF NOT EXISTS user_portfolio_featured_idx ON user_portfolio(featured);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_portfolio_updated_at 
    BEFORE UPDATE ON user_portfolio 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Set default values for existing records
UPDATE user_portfolio SET 
    category = 'other' 
WHERE category IS NULL;

UPDATE user_portfolio SET 
    tags = '[]'::jsonb 
WHERE tags IS NULL;

UPDATE user_portfolio SET 
    updated_at = created_at 
WHERE updated_at IS NULL;
