-- ============================================================================
-- ENGLISH LIBRARY
--
-- Catalogue entries for the temple Library page: Sri Rudram, the Pancha Suktam,
-- daily sandhya, puja vidhanam for Ganesha and Satyanarayana, Hanuman Chalisa
-- and the Ashtottara Shatanamavali of the principal deities -- all in English
-- transliteration.
--
-- Each entry LINKS to Vaidika Vignanam (vignanam.org) rather than hosting a
-- copy, so devotees always read the publisher's current, corrected text and the
-- temple is not redistributing someone else's files. To host your own PDF
-- instead, upload it in Admin -> Library and it will be offered for download
-- alongside the link.
--
-- Safe to run more than once: an entry is skipped if a book with the same title
-- already exists for this temple.
-- ============================================================================

WITH t AS (
  SELECT id FROM public.temples WHERE slug = 'hccna'
),
incoming (title, author, category, external_url, description, display_order) AS (
  VALUES
  ('Sri Rudram Laghunyasam', 'Krishna Yajurveda', 'Sri Rudram', 'https://vignanam.org/english/sri-rudram-laghunyasam.html', 'The preparatory nyasa recited before Sri Rudram, invoking the presence of Lord Shiva in the body of the chanter.', 0),
  ('Sri Rudram Namakam', 'Krishna Yajurveda', 'Sri Rudram', 'https://vignanam.org/english/sri-rudram-namakam.html', 'The first half of Sri Rudram, offering salutations to Lord Shiva in all his forms and in all of creation.', 10),
  ('Sri Rudram Chamakam', 'Krishna Yajurveda', 'Sri Rudram', 'https://vignanam.org/english/sri-rudram-chamakam.html', 'The second half of Sri Rudram, praying for the blessings and prosperity that sustain a righteous life.', 20),
  ('Purusha Suktam', 'Rig Veda', 'Pancha Suktam', 'https://vignanam.org/english/purusha-suktam.html', 'Hymn to the Cosmic Being, describing the universe as the body of the Supreme Purusha.', 30),
  ('Narayana Suktam', 'Krishna Yajurveda', 'Pancha Suktam', 'https://vignanam.org/english/narayana-suktam.html', 'Hymn to Lord Narayana as the indwelling reality of all beings.', 40),
  ('Sri Suktam', 'Rig Veda', 'Pancha Suktam', 'https://vignanam.org/english/sri-suktam.html', 'Hymn to Goddess Lakshmi, invoking prosperity, abundance and auspiciousness.', 50),
  ('Bhu Suktam', 'Krishna Yajurveda', 'Pancha Suktam', 'https://www.vignanam.org/media/english/bhu-suktam.html', 'Hymn to Bhudevi, the Earth Goddess, honouring the earth that supports and nourishes all life.', 60),
  ('Durga Suktam', 'Krishna Yajurveda', 'Pancha Suktam', 'https://vignanam.org/english/durga-suktam.html', 'Hymn to Goddess Durga, seeking her protection and safe passage through difficulty.', 70),
  ('Medha Suktam', 'Krishna Yajurveda', 'Pancha Suktam', 'https://vignanam.org/english/medha-suktam.html', 'Hymn for medha - intelligence, memory and clarity of mind. Often chanted for students.', 80),
  ('Nitya Sandhya Vandanam', 'Krishna Yajurveda', 'Nitya Puja', 'https://vignanam.org/english/nitya-sandhya-vandanam.html', 'The daily sandhya ritual performed at dawn, noon and dusk, with the Gayatri at its heart.', 90),
  ('Sarva Devata Gayatri Mantras', NULL, 'Nitya Puja', 'https://vignanam.org/english/sarva-devata-gayatri-mantras.html', 'Gayatri mantras addressed to each of the principal deities.', 100),
  ('Ganesha Chaturthi Pooja Vidhanam and Vrata Kalpam', NULL, 'Puja Vidhanam', 'https://vignanam.org/english/ganesha-chaturthi-pooja-vidhanam-&-vrata-kalpam.html', 'The complete procedure for Ganesha Chaturthi puja at home, with the vrata kalpam.', 110),
  ('Sri Satyanarayana Puja (Satyanarayana Swami Vratam)', NULL, 'Puja Vidhanam', 'https://vignanam.org/english/sri-satyanarayana-puja-satyanarayana-swami-vratam.html', 'The full order of worship for Satyanarayana Vratam, performed at the temple every month.', 120),
  ('Sri Satyanarayana Swami Vratha Katha', NULL, 'Puja Vidhanam', 'https://vignanam.org/english/sri-satyanarayana-swami-vratha-katha.html', 'The five chapters of the Satyanarayana story, read aloud during the vratam.', 130),
  ('Hanuman Chalisa', 'Goswami Tulsidas', 'Stotras', 'https://vignanam.org/english/hanuman-chalisa.html', 'Forty verses in praise of Hanuman, among the most widely recited devotional hymns.', 140),
  ('Lingashtakam', 'Adi Shankaracharya', 'Stotras', 'https://vignanam.org/english/lingashtakam.html', 'Eight verses in praise of the Shiva Linga.', 150),
  ('Dakshina Murthy Stotram', 'Adi Shankaracharya', 'Stotras', 'https://vignanam.org/english/dakshina-murthy-stotram.html', 'Shankaracharya''s hymn to Shiva as Dakshinamurthy, the silent teacher of Self-knowledge.', 160),
  ('Ganesha Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/ganesha-ashtottara-sata-namavali.html', 'The 108 names of Lord Ganesha, chanted with archana.', 170),
  ('Shiva Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/shiva-ashtottara-sata-namavali.html', 'The 108 names of Lord Shiva, chanted with archana.', 180),
  ('Sri Vishnu Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/sri-vishnu-ashtottara-sata-namavali.html', 'The 108 names of Lord Vishnu, chanted with archana.', 190),
  ('Venkateswara Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/venkateswara-ashtottara-sata-namavali.html', 'The 108 names of Lord Venkateswara, chanted with archana.', 200),
  ('Sree Maha Lakshmi Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/sree-maha-lakshmi-ashtottara-sata-naamaavali.html', 'The 108 names of Goddess Maha Lakshmi, chanted with archana.', 210),
  ('Durga Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/durga-ashtottara-sata-namavali.html', 'The 108 names of Goddess Durga, chanted with archana.', 220),
  ('Saraswati Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/saraswati-ashtottara-sata-namavali.html', 'The 108 names of Goddess Saraswati, chanted with archana.', 230),
  ('Hanuman Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/english/hanuman-ashtottara-sata-namavali.html', 'The 108 names of Lord Hanuman, chanted with archana.', 240),
  ('Subrahmanya Ashtottara Sata Namavali', NULL, 'Ashtottaram (108 Names)', 'https://vignanam.org/veda/subrahmanya-ashtottara-sata-namavali-english.html', 'The 108 names of Lord Subrahmanya, chanted with archana.', 250)
)
INSERT INTO public.books
  (temple_id, title, author, category, language, external_url, description, publication_info, display_order)
SELECT
  t.id,
  i.title,
  i.author,
  i.category,
  'English',
  i.external_url,
  i.description,
  'Text courtesy of Vaidika Vignanam (vignanam.org)',
  i.display_order
FROM incoming i
CROSS JOIN t
WHERE NOT EXISTS (
  SELECT 1 FROM public.books b
  WHERE b.temple_id = t.id AND b.title = i.title
);

-- ============================================================================
-- Allow PDFs in the media bucket so the Library can host documents too.
-- (The bucket was image-only, which would have rejected every upload here.)
-- ============================================================================
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
      'image/jpeg','image/png','image/webp','image/avif','image/gif','application/pdf'
    ],
    file_size_limit = 26214400  -- 25 MB, enough for a scanned puja book
WHERE id = 'temple-media';
