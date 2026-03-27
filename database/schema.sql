-- ================================================================
-- AgriTech Marketplace — Supabase PostgreSQL Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. ITEMS (unified table for all categories) ──────────────

CREATE TABLE items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  category            TEXT NOT NULL CHECK (category IN ('livestock','vet','feeds','products')),
  type                TEXT NOT NULL DEFAULT 'product' CHECK (type IN ('product','service')),

  -- General fields
  subcategory         TEXT,
  description         TEXT NOT NULL,
  location            TEXT NOT NULL,
  latitude            DECIMAL(9,6),
  longitude           DECIMAL(9,6),
  contact_phone       TEXT,
  status              TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold')),

  -- Pricing
  price               INTEGER,
  price_negotiable    BOOLEAN NOT NULL DEFAULT false,

  -- Livestock-specific
  breed               TEXT,
  age                 INTEGER,         -- years
  weight              INTEGER,         -- kg

  -- Vet-specific
  services_offered    TEXT,
  availability        TEXT,

  -- Feeds-specific
  feed_type           TEXT,
  quantity_available  TEXT,

  -- Products-specific
  product_type        TEXT,
  unit                TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for fast queries
CREATE INDEX idx_items_category    ON items (category);
CREATE INDEX idx_items_status      ON items (status);
CREATE INDEX idx_items_price       ON items (price);
CREATE INDEX idx_items_location    ON items USING gin(to_tsvector('english', location));
CREATE INDEX idx_items_search      ON items USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_items_created_at  ON items (created_at DESC);

-- ── 2. IMAGES ────────────────────────────────────────────────

CREATE TABLE images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id     UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_images_item_id ON images (item_id);

-- ── 3. LEADS ─────────────────────────────────────────────────

CREATE TABLE leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  item_id     UUID REFERENCES items(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_item_id    ON leads (item_id);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);

-- ── 4. REQUESTS (Farmer Request System) ──────────────────────

CREATE TABLE requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  category     TEXT CHECK (category IN ('livestock','vet','feeds','products')),
  request_text TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','responded')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_status     ON requests (status);
CREATE INDEX idx_requests_created_at ON requests (created_at DESC);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────

ALTER TABLE items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Public: read available items and images
CREATE POLICY "Public read items"   ON items   FOR SELECT USING (true);
CREATE POLICY "Public read images"  ON images  FOR SELECT USING (true);

-- Public: submit leads and requests
CREATE POLICY "Public insert leads"    ON leads    FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert requests" ON requests FOR INSERT WITH CHECK (true);

-- Admin (authenticated): full access to everything
CREATE POLICY "Admin manage items"    ON items    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage images"   ON images   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read leads"      ON leads    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete leads"    ON leads    FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage requests" ON requests FOR ALL  USING (auth.role() = 'authenticated');

-- ── STORAGE BUCKET ───────────────────────────────────────────
-- Create manually in Supabase Dashboard → Storage → New Bucket:
-- Name:               agritech-images
-- Public:             YES (checked)
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Max file size:      10MB

-- ── SAMPLE DATA ──────────────────────────────────────────────

INSERT INTO items (title, category, type, subcategory, breed, age, weight, price, price_negotiable, location, latitude, longitude, contact_phone, description, status)
VALUES
  ('Premium Boran Bull',          'livestock', 'product', 'Cow',     'Boran',    3, 420, 85000,  true,  'Meru Town, Meru County',  0.0470, 37.6496, '0712345678', 'Healthy Boran bull. Vaccinated and dewormed. Ideal for beef production.', 'available'),
  ('Friesian Dairy Cow – 20L/day','livestock', 'product', 'Cow',     'Friesian', 4, 480, 120000, false, 'Nkubu, Meru County',      0.0677, 37.7396, '0723456789', 'High-producing Friesian dairy cow currently milking 20 litres per day.',  'available'),
  ('Dorper Sheep Flock – 5 Head', 'livestock', 'product', 'Sheep',   'Dorper',   2, 55,  45000,  true,  'Tigania, Meru County',    0.1780, 37.9070, '0734567890', 'Five healthy Dorper sheep. All vaccinated.',                             'available'),
  ('Boer Goats – 3 Head',         'livestock', 'product', 'Goat',    'Boer',     1, 35,  18000,  true,  'Maua, Meru County',       0.2310, 37.9320, '0712345678', 'Three healthy Boer goats. Good for meat production.',                    'available'),
  ('Kienyeji Chicken – 50 Birds', 'livestock', 'product', 'Poultry', 'Kienyeji', 1, 2,   25000,  false, 'Imenti North, Meru',      0.0923, 37.6521, '0723456789', '50 healthy free-range Kienyeji chickens.',                               'available');

INSERT INTO items (title, category, type, subcategory, services_offered, availability, price, location, latitude, longitude, contact_phone, description, status)
VALUES
  ('Dr. James Mutua – Livestock Vet', 'vet', 'service', 'Livestock Vet', 'Vaccination, deworming, disease diagnosis, AI services', 'Mon–Sat 8am–6pm', NULL, 'Meru Town, Meru County', 0.0470, 37.6496, '0745678901', 'Qualified veterinary surgeon with 10+ years experience.', 'available'),
  ('Meru Animal Clinic',              'vet', 'service', 'General Practice', 'Vaccination, surgery, deworming, hoof trimming', 'Mon–Fri 7:30am–5:30pm', NULL, 'Nkubu, Meru County', 0.0677, 37.7396, '0756789012', 'Fully equipped vet clinic. Emergency call-out available.', 'available');

INSERT INTO items (title, category, type, subcategory, feed_type, quantity_available, price, price_negotiable, location, latitude, longitude, contact_phone, description, status)
VALUES
  ('Dairy Meal – 70kg Bag',         'feeds', 'product', 'Dairy Meal',           'Dairy Meal',         '200 bags', 3200, false, 'Meru Town, Meru County', 0.0470, 37.6496, '0712345678', 'High-quality dairy meal, 18% protein. Boosts milk production.', 'available'),
  ('Layers Mash – Chick & Growers', 'feeds', 'product', 'Poultry Feed',         'Poultry Feed',       '150 bags', 2800, true,  'Nkubu, Meru County',     0.0677, 37.7396, '0723456789', 'Premium layers mash. 16% protein. Fast growth and high egg production.', 'available'),
  ('Rhodes Grass Hay Bales',        'feeds', 'product', 'Hay & Silage',         'Hay',                '500 bales',350,  false, 'Laare, Meru County',     0.1521, 37.8234, '0734567890', 'Well-cured Rhodes grass hay bales, 15kg each.', 'available');

INSERT INTO items (title, category, type, subcategory, product_type, unit, price, price_negotiable, location, latitude, longitude, contact_phone, description, status)
VALUES
  ('Fresh Farm Milk – Daily Supply', 'products', 'product', 'Milk',          'Dairy',   'Per litre',       55,   false, 'Meru Town, Meru County', 0.0470, 37.6496, '0712345678', 'Fresh raw milk from Friesian cows. Available daily. Min order 10L.', 'available'),
  ('Farm Fresh Eggs – Trays',        'products', 'product', 'Eggs',          'Poultry', 'Per tray (30)',   420,  true,  'Imenti North, Meru',     0.0923, 37.6521, '0723456789', 'Fresh free-range eggs. Order by 6am for same-day delivery.', 'available'),
  ('Organic Cattle Manure – Bulk',   'products', 'product', 'Manure',        'Organic', 'Per tonne',      1500, true,  'Tigania, Meru County',   0.1780, 37.9070, '0734567890', 'Well-composted cattle manure. Excellent for farms and gardens.', 'available');
