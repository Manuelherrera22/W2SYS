# 🔧 CORRECCIÓN DE AUDIT LOG

## ❌ **PROBLEMA DETECTADO**

El error en el audit log se debe a que la tabla `audit_logs` no está correctamente configurada en Supabase.

## ✅ **SOLUCIÓN**

### **1. Ejecutar SQL en Supabase**

Ve a tu proyecto Supabase → SQL Editor y ejecuta el siguiente código:

```sql
-- Audit Logs Table Setup
-- Run this in Supabase SQL Editor

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create RLS policies for audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can insert audit logs" ON audit_logs;
CREATE POLICY "Users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON audit_logs TO authenticated;
GRANT INSERT ON audit_logs TO authenticated;
```

### **2. Verificar Configuración**

Después de ejecutar el SQL:

1. Ve a **Supabase Dashboard** → **Table Editor**
2. Verifica que la tabla `audit_logs` existe
3. Verifica que tiene las columnas correctas:
   - `id` (UUID)
   - `user_id` (UUID)
   - `action` (VARCHAR)
   - `table_name` (VARCHAR)
   - `record_id` (TEXT)
   - `old_data` (JSONB)
   - `new_data` (JSONB)
   - `ip_address` (TEXT)
   - `user_agent` (TEXT)
   - `created_at` (TIMESTAMP)

### **3. Probar Funcionalidad**

1. Ve a http://localhost:3000
2. Inicia sesión como admin
3. Ve a **Audit Log** en el menú
4. Debería cargar sin errores

## 🔍 **CAMBIOS REALIZADOS**

### **Archivos Corregidos:**
- `lib/audit/AuditLogManager.ts` - Corregidos nombres de columnas
- `components/AuditLogViewer.tsx` - Simplificada consulta
- `supabase-audit-logs-setup.sql` - SQL de configuración

### **Problemas Solucionados:**
- ✅ Nombres de columnas (`old_values` → `old_data`, `new_values` → `new_data`)
- ✅ Relación de foreign key simplificada
- ✅ Políticas RLS corregidas
- ✅ Permisos de usuario configurados

## 🎯 **RESULTADO ESPERADO**

Después de ejecutar el SQL:
- ✅ Audit Log carga correctamente
- ✅ Se registran automáticamente las acciones
- ✅ Filtros funcionan correctamente
- ✅ Paginación funciona
- ✅ Datos se muestran sin errores

## 🚨 **IMPORTANTE**

Si sigues viendo errores después de ejecutar el SQL:

1. **Verifica permisos**: Asegúrate de estar logueado como admin
2. **Revisa RLS**: Las políticas deben estar activas
3. **Comprueba datos**: Debe haber al menos un usuario con rol 'admin'
4. **Revisa consola**: Busca errores específicos en la consola del navegador

**¡El audit log debería funcionar perfectamente después de ejecutar el SQL!** 🚀
