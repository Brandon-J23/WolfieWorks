-- Add user_type column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('freelancer', 'client', 'both'));

-- Create an index on user_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);

-- Update the handle_new_user function to include user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a comment to document the user_type column
COMMENT ON COLUMN user_profiles.user_type IS 'User role: freelancer, client, or both';
