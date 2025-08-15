-- Simpler storage policies for user uploads

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for user uploads" ON storage.objects;

-- Ensure the bucket exists with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-uploads', 'user-uploads', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/*'];

-- Simple policy: Allow authenticated users to upload files that start with avatars/{their_user_id}
CREATE POLICY "Authenticated users can upload avatar files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND starts_with(name, 'avatars/' || auth.uid()::text || '-')
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own avatar files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND starts_with(name, 'avatars/' || auth.uid()::text || '-')
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own avatar files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND starts_with(name, 'avatars/' || auth.uid()::text || '-')
);

-- Allow public read access to user uploads (for viewing profile pictures)
CREATE POLICY "Public read access for user uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
