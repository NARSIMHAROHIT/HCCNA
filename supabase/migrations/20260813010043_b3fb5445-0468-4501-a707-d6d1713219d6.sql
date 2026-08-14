-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin','temple_admin','priest','devotee');
CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','assigned','completed','cancelled','rescheduled');
CREATE TYPE public.payment_status AS ENUM ('unpaid','pending','paid','refunded','waived');
CREATE TYPE public.service_location AS ENUM ('temple','home','either');

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- ============ TEMPLES ============
CREATE TABLE public.temples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  tagline text,
  about_html text,
  history_html text,
  mission_html text,
  logo_url text,
  favicon_url text,
  hero_image_url text,
  address_line1 text, address_line2 text, city text, state text, postal_code text, country text DEFAULT 'USA',
  latitude double precision NOT NULL DEFAULT 34.7304,
  longitude double precision NOT NULL DEFAULT -86.5861,
  timezone text NOT NULL DEFAULT 'America/Chicago',
  phone text, email text, website text,
  facebook_url text, instagram_url text, youtube_url text, whatsapp_url text,
  brand_primary text DEFAULT '#E07A1F',
  brand_secondary text DEFAULT '#B8862B',
  currency text NOT NULL DEFAULT 'USD',
  seo_title text, seo_description text,
  is_active boolean NOT NULL DEFAULT true,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.temples TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.temples TO authenticated;
GRANT ALL ON public.temples TO service_role;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES / ROLES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  temple_id uuid REFERENCES public.temples(id) ON DELETE SET NULL,
  full_name text,
  email text,
  phone text,
  address text,
  city text, state text, postal_code text,
  preferred_language text DEFAULT 'en',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temple_id uuid REFERENCES public.temples(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, temple_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.manages_temple(_user_id uuid, _temple_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND (ur.role = 'super_admin' OR (ur.role = 'temple_admin' AND ur.temple_id = _temple_id))
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'devotee')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "temples public read" ON public.temples FOR SELECT USING (is_active);
CREATE POLICY "temples admin write" ON public.temples FOR ALL TO authenticated
  USING (public.manages_temple(auth.uid(), id)) WITH CHECK (public.manages_temple(auth.uid(), id));
CREATE POLICY "profiles own" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id OR public.manages_temple(auth.uid(), temple_id))
  WITH CHECK (auth.uid() = id);
CREATE POLICY "roles read own" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.manages_temple(auth.uid(), temple_id));

-- ============ CONTENT TABLES ============
CREATE TABLE public.deities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  name text NOT NULL, description text, image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.temple_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Regular',
  day_of_week int,
  special_date date,
  opens_at time, closes_at time,
  is_closed boolean NOT NULL DEFAULT false,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.priests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  title text,
  photo_url text,
  biography text,
  qualifications text,
  languages text[] NOT NULL DEFAULT '{}',
  specializations text[] NOT NULL DEFAULT '{}',
  phone text, email text,
  max_bookings_per_day int NOT NULL DEFAULT 6,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.priest_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  priest_id uuid NOT NULL REFERENCES public.priests(id) ON DELETE CASCADE,
  day_of_week int NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.priest_blackouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  priest_id uuid NOT NULL REFERENCES public.priests(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  name text NOT NULL, slug text NOT NULL, description text,
  display_order int NOT NULL DEFAULT 0,
  UNIQUE (temple_id, slug)
);

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  slug text NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  duration_minutes int NOT NULL DEFAULT 60,
  buffer_minutes int NOT NULL DEFAULT 30,
  price_cents int NOT NULL DEFAULT 0,
  location_type public.service_location NOT NULL DEFAULT 'either',
  requires_priest boolean NOT NULL DEFAULT true,
  preparation_instructions text,
  required_materials text,
  image_url text,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  min_notice_hours int NOT NULL DEFAULT 24,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (temple_id, slug)
);

CREATE TABLE public.priest_services (
  priest_id uuid NOT NULL REFERENCES public.priests(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (priest_id, service_id)
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  deity text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  recurrence text,
  location text,
  image_url text,
  priest_id uuid REFERENCES public.priests(id) ON DELETE SET NULL,
  registration_required boolean NOT NULL DEFAULT false,
  max_attendees int,
  fee_cents int NOT NULL DEFAULT 0,
  registration_deadline timestamptz,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (temple_id, slug)
);

CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  title text NOT NULL, author text, description text,
  category text, language text DEFAULT 'English',
  cover_url text, file_url text, external_url text,
  publication_info text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  title text NOT NULL, body text, link_url text,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text, seo_description text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (temple_id, slug)
);

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  url text NOT NULL, folder text DEFAULT 'general',
  alt_text text, caption text, mime_type text, size_bytes bigint,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  position text,
  email text, phone text, photo_url text, bio text,
  term text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  donor_name text NOT NULL,
  tier text,
  amount_cents int,
  category text,
  year int,
  message text,
  is_anonymous boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- public content grants + RLS
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['deities','temple_schedules','priests','priest_availability','priest_blackouts','service_categories','services','priest_services','events','books','announcements','pages','media','board_members','donors']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

CREATE POLICY "deities read" ON public.deities FOR SELECT USING (true);
CREATE POLICY "deities admin" ON public.deities FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "schedules read" ON public.temple_schedules FOR SELECT USING (true);
CREATE POLICY "schedules admin" ON public.temple_schedules FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "priests read" ON public.priests FOR SELECT USING (is_active);
CREATE POLICY "priests admin" ON public.priests FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "availability read" ON public.priest_availability FOR SELECT USING (true);
CREATE POLICY "availability admin" ON public.priest_availability FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND (public.manages_temple(auth.uid(), p.temple_id) OR p.user_id = auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND (public.manages_temple(auth.uid(), p.temple_id) OR p.user_id = auth.uid())));
CREATE POLICY "blackouts read" ON public.priest_blackouts FOR SELECT USING (true);
CREATE POLICY "blackouts admin" ON public.priest_blackouts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND (public.manages_temple(auth.uid(), p.temple_id) OR p.user_id = auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND (public.manages_temple(auth.uid(), p.temple_id) OR p.user_id = auth.uid())));
CREATE POLICY "cats read" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "cats admin" ON public.service_categories FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "services read" ON public.services FOR SELECT USING (is_active);
CREATE POLICY "services admin" ON public.services FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "ps read" ON public.priest_services FOR SELECT USING (true);
CREATE POLICY "ps admin" ON public.priest_services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND public.manages_temple(auth.uid(), p.temple_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND public.manages_temple(auth.uid(), p.temple_id)));
CREATE POLICY "events read" ON public.events FOR SELECT USING (status = 'published');
CREATE POLICY "events admin" ON public.events FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "books read" ON public.books FOR SELECT USING (true);
CREATE POLICY "books admin" ON public.books FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "ann read" ON public.announcements FOR SELECT USING (is_published);
CREATE POLICY "ann admin" ON public.announcements FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "pages read" ON public.pages FOR SELECT USING (is_published);
CREATE POLICY "pages admin" ON public.pages FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "media read" ON public.media FOR SELECT USING (true);
CREATE POLICY "media admin" ON public.media FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "board read" ON public.board_members FOR SELECT USING (is_active);
CREATE POLICY "board admin" ON public.board_members FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "donors read" ON public.donors FOR SELECT USING (is_published);
CREATE POLICY "donors admin" ON public.donors FOR ALL TO authenticated USING (public.manages_temple(auth.uid(), temple_id)) WITH CHECK (public.manages_temple(auth.uid(), temple_id));

-- ============ BOOKINGS ============
CREATE SEQUENCE public.booking_reference_seq START 12345;
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('BK-' || nextval('public.booking_reference_seq')),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  priest_id uuid REFERENCES public.priests(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  location_type text NOT NULL DEFAULT 'temple',
  address text,
  contact_name text, contact_phone text, contact_email text,
  gotra text, nakshatra text,
  notes text,
  admin_notes text,
  priest_notes text,
  status public.booking_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  amount_cents int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_priest_time_idx ON public.bookings (priest_id, starts_at);
CREATE INDEX bookings_user_idx ON public.bookings (user_id, starts_at DESC);
CREATE INDEX bookings_temple_idx ON public.bookings (temple_id, starts_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings own read" ON public.bookings FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR public.manages_temple(auth.uid(), temple_id)
  OR EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND p.user_id = auth.uid())
);
CREATE POLICY "bookings own insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookings update" ON public.bookings FOR UPDATE TO authenticated USING (
  user_id = auth.uid()
  OR public.manages_temple(auth.uid(), temple_id)
  OR EXISTS (SELECT 1 FROM public.priests p WHERE p.id = priest_id AND p.user_id = auth.uid())
);
CREATE POLICY "bookings admin delete" ON public.bookings FOR DELETE TO authenticated USING (public.manages_temple(auth.uid(), temple_id));

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attendees int NOT NULL DEFAULT 1,
  notes text,
  status text NOT NULL DEFAULT 'registered',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regs own" ON public.event_registrations FOR ALL TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND public.manages_temple(auth.uid(), e.temple_id)))
  WITH CHECK (user_id = auth.uid());

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temple_id uuid REFERENCES public.temples(id) ON DELETE CASCADE,
  title text NOT NULL, body text, kind text NOT NULL DEFAULT 'general',
  link_url text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'general',
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  is_recurring boolean NOT NULL DEFAULT false,
  is_anonymous boolean NOT NULL DEFAULT false,
  donor_name text, donor_email text,
  status public.payment_status NOT NULL DEFAULT 'pending',
  provider text, provider_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "donations own" ON public.donations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id));
CREATE POLICY "donations insert" ON public.donations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============ PAYMENTS / RECEIPTS ============
CREATE SEQUENCE public.receipt_number_seq START 10001;
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number text NOT NULL UNIQUE DEFAULT ('HCC-' || nextval('public.receipt_number_seq')),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'pooja',
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  devotee_name text,
  devotee_email text,
  devotee_phone text,
  gotra text,
  nakshatra text,
  preferred_date date,
  notes text,
  status public.payment_status NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'stripe',
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payments_temple_idx ON public.payments (temple_id, created_at DESC);
CREATE INDEX payments_user_idx ON public.payments (user_id, created_at DESC);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments own read" ON public.payments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id));

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid REFERENCES public.temples(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, entity text, entity_id text, metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (public.manages_temple(auth.uid(), temple_id));

-- updated_at triggers
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['temples','profiles','deities','temple_schedules','priests','services','events','books','announcements','pages','bookings','board_members','donors','payments']
  LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t);
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.manages_temple(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.manages_temple(uuid, uuid) TO authenticated, service_role;