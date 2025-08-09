-- Create user_portfolio table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_portfolio (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    tags text[] DEFAULT '{}',
    file_url text,
    project_url text,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_portfolio_user_id ON user_portfolio(user_id);

-- Create an index on featured for faster featured portfolio queries
CREATE INDEX IF NOT EXISTS idx_user_portfolio_featured ON user_portfolio(featured);

-- Create an index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_user_portfolio_created_at ON user_portfolio(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE user_portfolio ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all portfolio items (for public profiles)
CREATE POLICY "Portfolio items are viewable by everyone" ON user_portfolio
    FOR SELECT USING (true);

-- Policy: Users can insert their own portfolio items
CREATE POLICY "Users can insert their own portfolio items" ON user_portfolio
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own portfolio items
CREATE POLICY "Users can update their own portfolio items" ON user_portfolio
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own portfolio items
CREATE POLICY "Users can delete their own portfolio items" ON user_portfolio
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_portfolio_updated_at ON user_portfolio;
CREATE TRIGGER update_user_portfolio_updated_at
    BEFORE UPDATE ON user_portfolio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
