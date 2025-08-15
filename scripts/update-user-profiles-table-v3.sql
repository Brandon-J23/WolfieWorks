-- Add avatar_url column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for user uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for user uploads" ON storage.objects;

-- Set up storage policies for user uploads
-- Allow authenticated users to upload files to their own folder (avatars/user_id-*)
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND starts_with(name, 'avatars/' || auth.uid()::text)
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND starts_with(name, 'avatars/' || auth.uid()::text)
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'avatars'
  AND starts_with(name, 'avatars/' || auth.uid()::text)
);

-- Allow public read access to user uploads (for viewing profile pictures)
CREATE POLICY "Public read access for user uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
