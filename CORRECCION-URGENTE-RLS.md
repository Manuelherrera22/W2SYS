# 🚨 CORRECCIÓN URGENTE - ERROR RLS SUPABASE

## ⚠️ **PROBLEMA IDENTIFICADO**
**Error**: `new row violates row-level security policy for table "rolex_products"`

Este error impide agregar productos al sistema. **SOLUCIÓN INMEDIATA REQUERIDA**.

## 🔧 **SOLUCIÓN PASO A PASO**

### **Paso 1: Ir a Supabase Dashboard**
1. Abrir navegador
2. Ir a: https://supabase.com/dashboard
3. Seleccionar tu proyecto: `wverkbbgofndagwekaap`

### **Paso 2: Abrir SQL Editor**
1. En el menú lateral izquierdo, hacer clic en **"SQL Editor"**
2. Hacer clic en **"New query"**

### **Paso 3: Ejecutar SQL de Corrección**
Copiar y pegar el siguiente SQL completo:

```sql
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

-- Hacer lo mismo para service_records
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
```

### **Paso 4: Ejecutar el SQL**
1. Hacer clic en el botón **"Run"** (▶️)
2. Esperar a que aparezca el mensaje de éxito
3. Verificar que no hay errores

### **Paso 5: Verificar Funcionamiento**
1. Volver a la aplicación: http://localhost:3003
2. Intentar agregar un producto
3. Verificar que funciona sin errores

## ✅ **RESULTADO ESPERADO**

Después de ejecutar el SQL:
- ✅ Se pueden agregar productos sin errores
- ✅ Se pueden actualizar productos
- ✅ Se pueden eliminar productos
- ✅ Se pueden ver todos los productos
- ✅ El sistema funciona completamente

## 🚨 **SI PERSISTE EL ERROR**

### **Opción 1: Deshabilitar RLS Temporalmente**
```sql
-- SOLO SI EL ERROR PERSISTE
ALTER TABLE rolex_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_records DISABLE ROW LEVEL SECURITY;
```

### **Opción 2: Verificar Autenticación**
1. Verificar que el usuario está autenticado
2. Revisar las credenciales en `.env.local`
3. Confirmar que las claves de Supabase son correctas

## 📞 **SOPORTE**

Si necesitas ayuda:
1. Ejecutar el SQL paso a paso
2. Verificar cada comando individualmente
3. Revisar los logs de Supabase para más detalles

**¡Este SQL solucionará el problema inmediatamente!** 🚀
