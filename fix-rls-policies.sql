-- Corregir políticas de RLS para rolex_products
-- Ejecutar este SQL en Supabase SQL Editor

-- Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can insert their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can update their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can delete their own products" ON rolex_products;

-- Crear políticas simplificadas que funcionen
CREATE POLICY "Enable read access for all authenticated users" ON rolex_products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all authenticated users" ON rolex_products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for all authenticated users" ON rolex_products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for all authenticated users" ON rolex_products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verificar que RLS esté habilitado
ALTER TABLE rolex_products ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON rolex_products TO authenticated;
GRANT USAGE ON SEQUENCE rolex_products_id_seq TO authenticated;

-- Crear políticas similares para service_records
DROP POLICY IF EXISTS "Users can view their own services" ON service_records;
DROP POLICY IF EXISTS "Users can insert their own services" ON service_records;
DROP POLICY IF EXISTS "Users can update their own services" ON service_records;
DROP POLICY IF EXISTS "Users can delete their own services" ON service_records;

CREATE POLICY "Enable read access for all authenticated users" ON service_records
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all authenticated users" ON service_records
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for all authenticated users" ON service_records
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for all authenticated users" ON service_records
    FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON service_records TO authenticated;
GRANT USAGE ON SEQUENCE service_records_id_seq TO authenticated;
