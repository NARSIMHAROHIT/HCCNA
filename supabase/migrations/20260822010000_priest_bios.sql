-- Add priest profiles for Pt. Pavan Kumar Vangala and Priest Dushyanta Padi.
-- Idempotent: skips a priest if a row with the same full_name already exists for this temple.

WITH t AS (SELECT id FROM public.temples WHERE slug = 'hccna')
INSERT INTO public.priests
  (temple_id, full_name, phone, biography, qualifications, languages, specializations, is_active, display_order)
SELECT
  t.id,
  'Pt. Pavan Kumar Vangala',
  '256-658-5559',
  'Pundit Pavan Kumar Sharma Vangala returned to HCCNA in March last year after getting his Permanent Residency Card. Pundit Pavan Kumar was born on January 5, 1982 in Vijayawada, India. He is married and is accompanied by his wife Ms. Lakshmi Revati. Pundit Pavan Kumar studied for 12 years in Sri Venkateshwara Veda Patha Shala of Tirupati Tirumala Devathanams during 1991-2003. He is considered as a Krishna Yajurveda Salakshana Ghanantam. Soon afterwards he served at Sri Anasuya Devi (Jillallamudiamma) Archakam as Veda Ganaparayanam.',
  'Krishna Yajurveda Salakshana Ghanantam. Studied for 12 years at Sri Venkateshwara Veda Patha Shala, Tirupati Tirumala Devathanams (1991-2003).',
  ARRAY['Telugu', 'Sanskrit', 'Hindi', 'Tamil', 'English'],
  ARRAY['Veda Ganaparayanam'],
  true,
  COALESCE((SELECT MAX(display_order) FROM public.priests WHERE temple_id = t.id), 0) + 1
FROM t
WHERE NOT EXISTS (
  SELECT 1 FROM public.priests p WHERE p.temple_id = t.id AND p.full_name = 'Pt. Pavan Kumar Vangala'
);

WITH t AS (SELECT id FROM public.temples WHERE slug = 'hccna')
INSERT INTO public.priests
  (temple_id, full_name, biography, qualifications, languages, specializations, is_active, display_order)
SELECT
  t.id,
  'Priest Dushyanta Padi',
  'Priest Dushyanta Padi studied at Veda Bhavan Puri Patshala for 11 years and received M. A. (Acharya) degree in Veda Bhasyam from National Sanskrit University in Tirupathi and M. Phil from Maharishi Sandipani Veda Vidya Pratisthan University at Ujjain. He was one of the few priests invited to study as Shisya of the Raj Purohit, Shri Suryanarayana Das of Jagannath Temple at Puri. Priest Dushyanta Padi worked at Siva Temple Rohini Sector 9 at New Delhi and at Geeta Ashram, Lagos, Nigeria. He has specialized in Nava Kalebar and Pran Pratistha of Lord Jagannath.',
  'M. A. (Acharya) in Veda Bhasyam, National Sanskrit University, Tirupathi. M. Phil, Maharishi Sandipani Veda Vidya Pratisthan University, Ujjain. Studied at Veda Bhavan Puri Patshala for 11 years.',
  ARRAY['Oriya', 'Bengali', 'Hindi', 'English'],
  ARRAY['Nava Kalebar', 'Pran Pratistha'],
  true,
  COALESCE((SELECT MAX(display_order) FROM public.priests WHERE temple_id = t.id), 0) + 1
FROM t
WHERE NOT EXISTS (
  SELECT 1 FROM public.priests p WHERE p.temple_id = t.id AND p.full_name = 'Priest Dushyanta Padi'
);
