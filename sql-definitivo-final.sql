-- ============================================
-- SQL DEFINITIVO - DESHABILITAR RLS COMPLETAMENTE
-- ============================================

-- DESHABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE rolex_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_records DISABLE ROW LEVEL SECURITY;

-- ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Users can view their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can insert their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can update their own products" ON rolex_products;
DROP POLICY IF EXISTS "Users can delete their own products" ON rolex_products;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON rolex_products;
DROP POLICY IF EXISTS "Enable insert for all authenticated users" ON rolex_products;
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON rolex_products;
DROP POLICY IF EXISTS "Enable delete for all authenticated users" ON rolex_products;

DROP POLICY IF EXISTS "Users can view their own services" ON service_records;
DROP POLICY IF EXISTS "Users can insert their own services" ON service_records;
DROP POLICY IF EXISTS "Users can update their own services" ON service_records;
DROP POLICY IF EXISTS "Users can delete their own services" ON service_records;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON service_records;
DROP POLICY IF EXISTS "Enable insert for all authenticated users" ON service_records;
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON service_records;
DROP POLICY IF EXISTS "Enable delete for all authenticated users" ON service_records;

-- OTORGAR PERMISOS COMPLETOS
GRANT SELECT, INSERT, UPDATE, DELETE ON rolex_products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON service_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON rolex_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON service_records TO anon;

-- VERIFICAR ESTADO DE LAS TABLAS
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    hasrls
FROM pg_tables 
WHERE tablename IN ('rolex_products', 'service_records');

-- ============================================
-- FIN DE LA CORRECCIÓN DEFINITIVA
-- ============================================
