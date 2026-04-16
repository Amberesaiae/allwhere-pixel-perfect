-- Fix overly permissive kiosk_stats UPDATE policy
DROP POLICY "Anyone can increment views" ON public.kiosk_stats;

-- Only the security definer function increment_kiosk_views can update stats
-- No direct UPDATE policy needed since the function uses SECURITY DEFINER

-- Fix public bucket listing - restrict to folder-level access
DROP POLICY "Kiosk images are publicly accessible" ON storage.objects;

CREATE POLICY "Kiosk images are publicly accessible by path"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'kiosk-images' AND (storage.foldername(name))[1] IS NOT NULL);