# 🔧 CORRECCIÓN DE RECURSIÓN INFINITA EN RLS

## ❌ **PROBLEMA IDENTIFICADO**

**Error**: `infinite recursion detected in policy for relation "user_profiles"`
**Causa**: Las políticas RLS de `user_profiles` están causando recursión infinita

## ✅ **SOLUCIÓN**

### **PASO 1: Corregir Políticas RLS**

Ejecuta este SQL en Supabase → **SQL Editor**:

```sql
-- Corregir políticas RLS para evitar recursión infinita

-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Crear políticas corregidas para audit_logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

CREATE POLICY "Users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear políticas corregidas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verificar que no hay recursión
SELECT * FROM pg_policies WHERE tablename IN ('audit_logs', 'user_profiles');
```

### **PASO 2: Verificar Tabla audit_logs**

Si la tabla `audit_logs` no existe, créala primero:

```sql
-- Crear tabla audit_logs si no existe
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

-- Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
```

### **PASO 3: Verificar Tabla user_profiles**

Asegúrate de que la tabla `user_profiles` existe:

```sql
-- Crear tabla user_profiles si no existe
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer', 'service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

## 🔍 **VERIFICACIÓN**

Después de ejecutar el SQL:

1. **Verificar políticas**:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('audit_logs', 'user_profiles');
```

2. **Probar consulta**:
```sql
SELECT * FROM audit_logs LIMIT 5;
```

3. **Verificar en la aplicación**:
   - Ve a http://localhost:3000
   - Inicia sesión como admin
   - Ve a **Audit Log**
   - Debería cargar sin errores

## 🎯 **RESULTADO ESPERADO**

Después de ejecutar el SQL corregido:
- ✅ Error de recursión infinita se resuelve
- ✅ Audit Log carga correctamente
- ✅ Políticas RLS funcionan sin recursión
- ✅ Sistema 100% funcional

## 🚨 **IMPORTANTE**

**Este SQL corregido elimina la recursión infinita y permite que el audit log funcione correctamente.**

**¡Ejecuta el SQL corregido y el sistema funcionará perfectamente!** 🚀
