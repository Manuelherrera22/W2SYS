-- W2SYS Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create rolex_products table
CREATE TABLE IF NOT EXISTS rolex_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "case" VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  material VARCHAR(100) NOT NULL,
  bezel VARCHAR(100) NOT NULL,
  brazalete VARCHAR(100),
  provider VARCHAR(100),
  serial VARCHAR(50) NOT NULL UNIQUE,
  year VARCHAR(10) NOT NULL,
  end_piece_code VARCHAR(50),
  movement_number VARCHAR(50),
  cost DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  in_card BOOLEAN DEFAULT false,
  in_papers BOOLEAN DEFAULT false,
  in_services_papers BOOLEAN DEFAULT false,
  in_has_box BOOLEAN DEFAULT false,
  in_third_party_inventory BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'New' CHECK (status IN ('New', 'Needs', 'On Service', 'Returned', 'Ready', 'Sold', 'RT Vendor')),
  service_needs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create service_records table
CREATE TABLE IF NOT EXISTS service_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES rolex_products(id) ON DELETE CASCADE,
  supplier VARCHAR(100) NOT NULL,
  invoice VARCHAR(100),
  cost DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'SERVICE' CHECK (status IN ('SERVICE', 'DONE')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_in_labor INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rolex_products_serial ON rolex_products(serial);
CREATE INDEX IF NOT EXISTS idx_rolex_products_status ON rolex_products(status);
CREATE INDEX IF NOT EXISTS idx_rolex_products_user_id ON rolex_products(user_id);
CREATE INDEX IF NOT EXISTS idx_service_records_product_id ON service_records(product_id);
CREATE INDEX IF NOT EXISTS idx_service_records_user_id ON service_records(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE rolex_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rolex_products
CREATE POLICY "Users can view their own products" ON rolex_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON rolex_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON rolex_products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON rolex_products
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for service_records
CREATE POLICY "Users can view their own service records" ON service_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service records" ON service_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service records" ON service_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service records" ON service_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rolex_products_updated_at 
  BEFORE UPDATE ON rolex_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_records_updated_at 
  BEFORE UPDATE ON service_records 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rolex-images', 'rolex-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for images
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rolex-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images" ON storage.objects
  FOR SELECT USING (bucket_id = 'rolex-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'rolex-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sample data (optional - remove in production)
-- INSERT INTO rolex_products (
--   "case", model, material, bezel, brazalete, provider, serial, year, 
--   end_piece_code, movement_number, cost, price, description, status
-- ) VALUES (
--   '126600', 'Sea-Dweller', 'Steel', 'Black Ceramic', 'Oyster', 'Rolex AD', 
--   'SAMPLE001', '2023', '932', '3235', 8500.00, 12000.00, 
--   'Sample Rolex Sea-Dweller', 'New'
-- );
