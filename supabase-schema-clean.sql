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

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer', 'service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_backups table
CREATE TABLE IF NOT EXISTS system_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  size INTEGER NOT NULL,
  type VARCHAR(20) DEFAULT 'full',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create system_alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action VARCHAR(255),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create notification_rules table
CREATE TABLE IF NOT EXISTS notification_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  condition VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for system_backups
CREATE POLICY "Users can view their own backups" ON system_backups
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all backups" ON system_backups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for system_alerts
CREATE POLICY "Users can view their own alerts" ON system_alerts
  FOR SELECT USING (auth.uid() = user_id OR user_id = 'system');

CREATE POLICY "Users can update their own alerts" ON system_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for notification_rules
CREATE POLICY "Admins can manage notification rules" ON notification_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
