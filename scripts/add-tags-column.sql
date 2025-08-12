-- Add the missing tags column to the existing user_portfolio table
ALTER TABLE user_portfolio 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create an index on tags for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_user_portfolio_tags ON user_portfolio USING GIN(tags);
