-- ============================================================
-- RASA NYIUR — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  category    text NOT NULL CHECK (category IN ('Makanan Utama','Rica-Rica & Sambal','Camilan','Minuman')),
  price       integer NOT NULL CHECK (price > 0),
  description text,
  image_path  text,                        -- e.g. /images/menu/tinutuan-glow-up.jpg
  rating      decimal(3,2) DEFAULT 4.5,
  cook_time   text,
  tags        text[] DEFAULT '{}',
  badges      text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_special  boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- OPTION GROUPS (per menu item)
-- ============================================================
CREATE TABLE IF NOT EXISTS option_groups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('single','multiple')),
  required     boolean DEFAULT false,
  sort_order   integer DEFAULT 0
);

-- ============================================================
-- OPTIONS (per option group)
-- ============================================================
CREATE TABLE IF NOT EXISTS options (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_group_id uuid NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE,
  name            text NOT NULL,
  price_add       integer DEFAULT 0,
  sort_order      integer DEFAULT 0
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     text UNIQUE NOT NULL,            -- format: RN-XXXXXXX
  user_id          uuid REFERENCES auth.users(id),  -- nullable for guest orders
  customer_name    text NOT NULL,
  customer_phone   text NOT NULL,
  delivery_address text,
  delivery_method  text NOT NULL CHECK (delivery_method IN ('delivery','pickup')),
  payment_method   text NOT NULL CHECK (payment_method IN ('qris','transfer','cod')),
  promo_code       text,
  discount_amount  integer DEFAULT 0,
  subtotal         integer NOT NULL,
  delivery_fee     integer DEFAULT 0,
  service_fee      integer DEFAULT 2000,
  total            integer NOT NULL,
  status           text DEFAULT 'pending' CHECK (
    status IN ('pending','paid','accepted','preparing','delivering','completed','cancelled')
  ),
  courier_name     text DEFAULT 'Karel Rompas',
  courier_vehicle  text DEFAULT 'DB 4521 MN',
  notes            text,
  eco_cutlery      boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id   uuid REFERENCES menu_items(id),
  menu_item_name text NOT NULL,
  quantity       integer NOT NULL CHECK (quantity > 0),
  unit_price     integer NOT NULL,
  customizations jsonb DEFAULT '[]',   -- selected options snapshot
  notes          text,
  subtotal       integer NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Allow public read on menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read menu_items"
  ON menu_items FOR SELECT USING (true);

-- Allow public read on option_groups and options
ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read option_groups"
  ON option_groups FOR SELECT USING (true);

ALTER TABLE options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read options"
  ON options FOR SELECT USING (true);

-- Orders: anyone can insert (guest), user can read their own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders by order_number"
  ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update order status"
  ON orders FOR UPDATE USING (true);

-- Order items: same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert order_items"
  ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read order_items"
  ON order_items FOR SELECT USING (true);

-- ============================================================
-- FUNCTION: auto-update `updated_at` on orders
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
