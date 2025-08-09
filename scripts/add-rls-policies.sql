-- Add RLS policies for user_portfolio table

-- Policy: Users can view all portfolio items (for public profiles)
DROP POLICY IF EXISTS "Portfolio items are viewable by everyone" ON user_portfolio;
CREATE POLICY "Portfolio items are viewable by everyone" ON user_portfolio
    FOR SELECT USING (true);

-- Policy: Users can insert their own portfolio items
DROP POLICY IF EXISTS "Users can insert their own portfolio items" ON user_portfolio;
CREATE POLICY "Users can insert their own portfolio items" ON user_portfolio
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own portfolio items
DROP POLICY IF EXISTS "Users can update their own portfolio items" ON user_portfolio;
CREATE POLICY "Users can update their own portfolio items" ON user_portfolio
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own portfolio items
DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON user_portfolio;
CREATE POLICY "Users can delete their own portfolio items" ON user_portfolio
    FOR DELETE USING (auth.uid() = user_id);
