-- Simple bucket setup (this should work with default permissions)
-- Run this in Supabase SQL Editor

-- Create or update the user-uploads bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-uploads', 'user-uploads', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/*'];

-- Alternative: Create a public bucket that doesn't require RLS policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-avatars', 'public-avatars', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;
