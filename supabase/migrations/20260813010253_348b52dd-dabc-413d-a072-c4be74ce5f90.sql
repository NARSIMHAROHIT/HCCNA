-- ===== Priest details =====
ALTER TABLE public.priests
  ADD COLUMN working_since date,
  ADD COLUMN working_days text[] NOT NULL DEFAULT '{}';

-- ===== Event details =====
ALTER TABLE public.events
  ADD COLUMN is_annual boolean NOT NULL DEFAULT false,
  ADD COLUMN sponsor_name text,
  ADD COLUMN sponsor_contact text,
  ADD COLUMN sponsor_note text,
  ADD COLUMN sponsorship_amount_cents int,
  ADD COLUMN volunteers_needed boolean NOT NULL DEFAULT false;

CREATE TABLE public.event_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity text,
  note text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_items TO authenticated;
GRANT ALL ON public.event_items TO service_role;
ALTER TABLE public.event_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event items read" ON public.event_items FOR SELECT USING (true);
CREATE POLICY "event items admin" ON public.event_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND public.manages_temple(auth.uid(), e.temple_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND public.manages_temple(auth.uid(), e.temple_id)));

CREATE TABLE public.event_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  title text,
  caption text,
  image_url text NOT NULL,
  taken_on date,
  year int,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_photos TO authenticated;
GRANT ALL ON public.event_photos TO service_role;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event photos read" ON public.event_photos FOR SELECT USING (true);
CREATE POLICY "event photos admin" ON public.event_photos FOR ALL TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));

-- ===== Newsletter =====
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  full_name text,
  phone text,
  wants_volunteering boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (temple_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter admin read" ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id) OR user_id = auth.uid());
CREATE POLICY "newsletter self insert" ON public.newsletter_subscribers FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "newsletter self update" ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id))
  WITH CHECK (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "newsletter admin delete" ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id));

-- ===== Volunteers =====
CREATE TABLE public.event_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role_preference text,
  availability text,
  notes text,
  status text NOT NULL DEFAULT 'signed_up',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_volunteers TO authenticated;
GRANT ALL ON public.event_volunteers TO service_role;
ALTER TABLE public.event_volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "volunteers own" ON public.event_volunteers FOR ALL TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND public.manages_temple(auth.uid(), e.temple_id)))
  WITH CHECK (user_id = auth.uid());

-- ===== Admin management of roles =====
CREATE POLICY "roles admin read all" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'temple_admin'));
GRANT INSERT, DELETE ON public.user_roles TO authenticated;
CREATE POLICY "roles admin insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "roles admin delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id) AND user_id <> auth.uid());

-- ===== Audit logging =====
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS changes jsonb;

CREATE OR REPLACE FUNCTION public.log_entity_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_temple_id uuid;
  v_changes jsonb := '{}'::jsonb;
  v_old jsonb;
  v_new jsonb;
  k text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_old := to_jsonb(OLD);
    v_temple_id := NULLIF(v_old->>'temple_id','')::uuid;
    INSERT INTO public.audit_logs (temple_id, actor_id, action, entity, entity_id, metadata, changes)
    VALUES (v_temple_id, auth.uid(), 'delete', TG_TABLE_NAME, OLD.id::text,
            jsonb_build_object('label', COALESCE(v_old->>'title', v_old->>'full_name', v_old->>'donor_name', v_old->>'name')),
            jsonb_build_object('before', v_old));
    RETURN OLD;
  END IF;

  v_new := to_jsonb(NEW);
  v_temple_id := NULLIF(v_new->>'temple_id','')::uuid;

  IF TG_OP = 'UPDATE' THEN
    v_old := to_jsonb(OLD);
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF k <> 'updated_at' AND COALESCE(v_old->k, 'null'::jsonb) IS DISTINCT FROM COALESCE(v_new->k, 'null'::jsonb) THEN
        v_changes := v_changes || jsonb_build_object(k, jsonb_build_object('from', v_old->k, 'to', v_new->k));
      END IF;
    END LOOP;
    IF v_changes = '{}'::jsonb THEN
      RETURN NEW;
    END IF;
  ELSE
    v_changes := jsonb_build_object('after', v_new);
  END IF;

  INSERT INTO public.audit_logs (temple_id, actor_id, action, entity, entity_id, metadata, changes)
  VALUES (v_temple_id, auth.uid(), lower(TG_OP), TG_TABLE_NAME, NEW.id::text,
          jsonb_build_object('label', COALESCE(v_new->>'title', v_new->>'full_name', v_new->>'donor_name', v_new->>'name')),
          v_changes);
  RETURN NEW;
END; $$;

REVOKE ALL ON FUNCTION public.log_entity_change() FROM PUBLIC, anon, authenticated;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['events','priests','donors','deities']
  LOOP
    EXECUTE format('CREATE TRIGGER audit_changes AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.log_entity_change()', t);
  END LOOP;
END $$;

CREATE INDEX audit_logs_temple_idx ON public.audit_logs (temple_id, created_at DESC);