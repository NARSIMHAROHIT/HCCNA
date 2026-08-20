-- ============================================================================
-- 1. MAP LOCATION
-- The postal address is a P.O. Box, which Google cannot place on a map. Keep the
-- mailing address as-is and add a separate physical address used only for the
-- map embed and the "Open in Google Maps" link.
-- ============================================================================

ALTER TABLE public.temples ADD COLUMN IF NOT EXISTS map_address text;

UPDATE public.temples
SET map_address = '14800 Vishnu Way, Harvest, AL 35749'
WHERE slug = 'hccna'
  AND (map_address IS NULL OR map_address = '');

-- ============================================================================
-- 2. MEDIA UPLOADS
-- A public bucket so admins can upload event photographs from their computer
-- instead of hosting them elsewhere and pasting a URL.
--   * anyone may READ (the gallery is public)
--   * only temple admins may WRITE
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'temple-media',
  'temple-media',
  true,
  15728640,  -- 15 MB per file
  ARRAY['image/jpeg','image/png','image/webp','image/avif','image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Helper: is this user allowed to manage temple media?
CREATE OR REPLACE FUNCTION public.can_manage_media(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role IN ('temple_admin','super_admin')
  )
$$;

REVOKE ALL ON FUNCTION public.can_manage_media(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_manage_media(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "temple media public read" ON storage.objects;
CREATE POLICY "temple media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'temple-media');

DROP POLICY IF EXISTS "temple media admin insert" ON storage.objects;
CREATE POLICY "temple media admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'temple-media' AND public.can_manage_media(auth.uid()));

DROP POLICY IF EXISTS "temple media admin update" ON storage.objects;
CREATE POLICY "temple media admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'temple-media' AND public.can_manage_media(auth.uid()))
  WITH CHECK (bucket_id = 'temple-media' AND public.can_manage_media(auth.uid()));

DROP POLICY IF EXISTS "temple media admin delete" ON storage.objects;
CREATE POLICY "temple media admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'temple-media' AND public.can_manage_media(auth.uid()));
