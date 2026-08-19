-- ============================================================================
-- 1. SQUARE PAYMENTS
-- The payments table already carries a `provider` column ('stripe' by default).
-- These columns let the same table hold Square Checkout links and their orders,
-- so Stripe keeps working as a fallback while Square becomes the default.
-- ============================================================================

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS square_order_id text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS square_payment_id text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS square_payment_link_id text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_square_order_idx
  ON public.payments (square_order_id)
  WHERE square_order_id IS NOT NULL;

-- ============================================================================
-- 2. HALL RENTAL
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$ BEGIN
  CREATE TYPE public.hall_booking_status AS ENUM
    ('requested','held','confirmed','cancelled','completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.halls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  capacity int NOT NULL DEFAULT 100,
  area_sqft int,
  image_url text,
  amenities text[] NOT NULL DEFAULT '{}',
  -- Pricing. A booking is charged on ONE basis: hourly, half-day or full-day.
  hourly_rate_cents int NOT NULL DEFAULT 0,
  half_day_rate_cents int NOT NULL DEFAULT 0,
  full_day_rate_cents int NOT NULL DEFAULT 0,
  cleaning_fee_cents int NOT NULL DEFAULT 0,
  deposit_cents int NOT NULL DEFAULT 0,
  -- Booking rules
  min_hours int NOT NULL DEFAULT 2,
  max_hours int NOT NULL DEFAULT 12,
  opens_at time NOT NULL DEFAULT '08:00',
  closes_at time NOT NULL DEFAULT '22:00',
  min_notice_days int NOT NULL DEFAULT 7,
  max_advance_days int NOT NULL DEFAULT 365,
  buffer_minutes int NOT NULL DEFAULT 60,
  rules text,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (temple_id, slug)
);

CREATE SEQUENCE IF NOT EXISTS public.hall_booking_reference_seq START 5001;

CREATE TABLE IF NOT EXISTS public.hall_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('HALL-' || nextval('public.hall_booking_reference_seq')),
  temple_id uuid NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
  hall_id uuid NOT NULL REFERENCES public.halls(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_title text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  guest_count int NOT NULL DEFAULT 1,
  rate_basis text NOT NULL DEFAULT 'hourly',
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  organisation text,
  needs_kitchen boolean NOT NULL DEFAULT false,
  needs_av boolean NOT NULL DEFAULT false,
  needs_tables boolean NOT NULL DEFAULT false,
  setup_notes text,
  notes text,
  admin_notes text,
  status public.hall_booking_status NOT NULL DEFAULT 'requested',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  rental_cents int NOT NULL DEFAULT 0,
  cleaning_fee_cents int NOT NULL DEFAULT 0,
  deposit_cents int NOT NULL DEFAULT 0,
  total_cents int NOT NULL DEFAULT 0,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT hall_bookings_time_order CHECK (ends_at > starts_at)
);

-- The database itself refuses two live bookings that overlap in the same hall,
-- so a race between two devotees cannot double-book a date.
DO $$ BEGIN
  ALTER TABLE public.hall_bookings ADD CONSTRAINT hall_bookings_no_overlap
    EXCLUDE USING gist (
      hall_id WITH =,
      tstzrange(starts_at, ends_at, '[)') WITH &&
    ) WHERE (status IN ('requested','held','confirmed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS hall_bookings_hall_time_idx ON public.hall_bookings (hall_id, starts_at);
CREATE INDEX IF NOT EXISTS hall_bookings_user_idx ON public.hall_bookings (user_id, starts_at DESC);
CREATE INDEX IF NOT EXISTS hall_bookings_temple_idx ON public.hall_bookings (temple_id, starts_at);

-- ---------------------------------------------------------------- halls RLS
GRANT SELECT ON public.halls TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.halls TO authenticated;
GRANT ALL ON public.halls TO service_role;
ALTER TABLE public.halls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "halls read" ON public.halls;
CREATE POLICY "halls read" ON public.halls FOR SELECT USING (true);

DROP POLICY IF EXISTS "halls admin" ON public.halls;
CREATE POLICY "halls admin" ON public.halls FOR ALL TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id))
  WITH CHECK (public.manages_temple(auth.uid(), temple_id));

-- -------------------------------------------------------- hall_bookings RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hall_bookings TO authenticated;
GRANT ALL ON public.hall_bookings TO service_role;
ALTER TABLE public.hall_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hall bookings own read" ON public.hall_bookings;
CREATE POLICY "hall bookings own read" ON public.hall_bookings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id));

DROP POLICY IF EXISTS "hall bookings own insert" ON public.hall_bookings;
CREATE POLICY "hall bookings own insert" ON public.hall_bookings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "hall bookings update" ON public.hall_bookings;
CREATE POLICY "hall bookings update" ON public.hall_bookings FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.manages_temple(auth.uid(), temple_id));

DROP POLICY IF EXISTS "hall bookings admin delete" ON public.hall_bookings;
CREATE POLICY "hall bookings admin delete" ON public.hall_bookings FOR DELETE TO authenticated
  USING (public.manages_temple(auth.uid(), temple_id));

-- Public availability WITHOUT exposing who booked: a definer function that
-- returns only the busy time ranges. This is what the public calendar reads.
CREATE OR REPLACE FUNCTION public.hall_busy_ranges(
  _hall_id uuid,
  _from timestamptz,
  _to timestamptz
)
RETURNS TABLE (starts_at timestamptz, ends_at timestamptz, status text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hb.starts_at, hb.ends_at, hb.status::text
  FROM public.hall_bookings hb
  WHERE hb.hall_id = _hall_id
    AND hb.status <> 'cancelled'
    AND hb.starts_at < _to
    AND hb.ends_at > _from
  ORDER BY hb.starts_at
$$;

REVOKE ALL ON FUNCTION public.hall_busy_ranges(uuid, timestamptz, timestamptz) FROM public;
GRANT EXECUTE ON FUNCTION public.hall_busy_ranges(uuid, timestamptz, timestamptz) TO anon, authenticated, service_role;

-- updated_at triggers, matching the rest of the schema
DROP TRIGGER IF EXISTS set_updated_at ON public.halls;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.halls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON public.hall_bookings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.hall_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. SEED — one hall so the page is not empty. Edit it in Admin → Halls.
-- ============================================================================
INSERT INTO public.halls (
  temple_id, slug, name, short_description, description, capacity, area_sqft,
  amenities, hourly_rate_cents, half_day_rate_cents, full_day_rate_cents,
  cleaning_fee_cents, deposit_cents, min_hours, max_hours, min_notice_days, rules, display_order
)
SELECT
  t.id,
  'community-hall',
  'Community Hall',
  'Our main hall for weddings, receptions, birthdays, cultural programmes and community gatherings.',
  'The community hall adjoins the temple and is available to devotees and the wider community. It includes tables and chairs, a serving kitchen, and parking. Decorations are welcome; open flame, confetti and adhesive fixings on the walls are not.',
  200,
  3200,
  ARRAY['Tables and chairs','Serving kitchen','Sound system','Projector and screen','Restrooms','On-site parking','Air conditioning'],
  15000,
  50000,
  90000,
  15000,
  25000,
  3,
  12,
  7,
  'Bookings are confirmed once the refundable security deposit is received. The hall must be vacated and left clean by the end time on the booking; additional hours are billed at the hourly rate. Alcohol and non-vegetarian food are not permitted on temple premises.',
  0
FROM public.temples t
WHERE t.slug = 'hccna'
ON CONFLICT (temple_id, slug) DO NOTHING;
