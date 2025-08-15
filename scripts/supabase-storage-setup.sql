-- Storage setup for Supabase (run as superuser or through Supabase Dashboard)

-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-uploads', 'user-uploads', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Note: The following policies need to be created through the Supabase Dashboard
-- Go to Storage → Policies in your Supabase Dashboard and create these policies:

/*
Policy 1: Allow authenticated users to upload avatar files
- Operation: INSERT
- Policy name: Authenticated users can upload avatar files
- Policy definition:
(bucket_id = 'user-uploads'::text) AND (auth.role() = 'authenticated'::text) AND starts_with(name, (('avatars/'::text || (auth.uid())::text) || '-'::text))

Policy 2: Allow users to update their own avatar files  
- Operation: UPDATE
- Policy name: Users can update their own avatar files
- Policy definition:
(bucket_id = 'user-uploads'::text) AND (auth.role() = 'authenticated'::text) AND starts_with(name, (('avatars/'::text || (auth.uid())::text) || '-'::text))

Policy 3: Allow users to delete their own avatar files
- Operation: DELETE  
- Policy name: Users can delete their own avatar files
- Policy definition:
(bucket_id = 'user-uploads'::text) AND (auth.role() = 'authenticated'::text) AND starts_with(name, (('avatars/'::text || (auth.uid())::text) || '-'::text))

Policy 4: Allow public read access
- Operation: SELECT
- Policy name: Public read access for user uploads  
- Policy definition:
bucket_id = 'user-uploads'::text
*/
