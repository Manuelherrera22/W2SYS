# 🔧 CORRECCIÓN SQL - CREAR USUARIOS SIN ERRORES

## ❌ **PROBLEMA IDENTIFICADO**
El error muestra: `column "updated_at" of relation "user_profiles" does not exist`

## ✅ **SOLUCIÓN CORREGIDA**

### **SQL Corregido para Crear Usuarios:**

```sql
-- Crear usuarios de prueba (ejecutar en Supabase SQL Editor)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', crypt('manager123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', crypt('viewer123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', crypt('service123', gen_salt('bf')), NOW(), NOW(), NOW());

-- Crear perfiles de usuario (SIN updated_at)
INSERT INTO user_profiles (id, email, full_name, role, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', 'Administrador', 'admin', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', 'Manager', 'manager', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', 'Viewer', 'viewer', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', 'Service', 'service', NOW());
```

## 🔑 **CREDENCIALES DE USUARIO**

### **Usuario Administrador**
- **Email**: `admin@w2sys.com`
- **Contraseña**: `admin123`
- **Rol**: Admin (acceso completo)

### **Usuario Manager**
- **Email**: `manager@w2sys.com`
- **Contraseña**: `manager123`
- **Rol**: Manager (editar productos)

### **Usuario Viewer**
- **Email**: `viewer@w2sys.com`
- **Contraseña**: `viewer123`
- **Rol**: Viewer (solo lectura)

### **Usuario Service**
- **Email**: `service@w2sys.com`
- **Contraseña**: `service123`
- **Rol**: Service (gestión de servicios)

## 🚀 **INSTRUCCIONES PASO A PASO**

### **Paso 1: Ejecutar SQL de Permisos**
```sql
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
```

### **Paso 2: Crear Usuarios (SQL Corregido)**
```sql
-- Crear usuarios de prueba (ejecutar en Supabase SQL Editor)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', crypt('manager123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', crypt('viewer123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', crypt('service123', gen_salt('bf')), NOW(), NOW(), NOW());

-- Crear perfiles de usuario (SIN updated_at)
INSERT INTO user_profiles (id, email, full_name, role, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', 'Administrador', 'admin', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', 'Manager', 'manager', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', 'Viewer', 'viewer', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', 'Service', 'service', NOW());
```

### **Paso 3: Acceder al Sistema**
1. Abrir http://localhost:3003
2. Hacer clic en "Iniciar Sesión"
3. Usar cualquiera de las credenciales de arriba
4. ¡Disfrutar del sistema completo!

## 🎯 **ALTERNATIVA: Crear Usuario desde la Interfaz**

Si prefieres crear usuarios desde la interfaz:

1. Abrir http://localhost:3003
2. Hacer clic en "Iniciar Sesión"
3. Cambiar a "Crear Cuenta"
4. Llenar los datos:
   - **Nombre Completo**: Tu nombre
   - **Rol**: Seleccionar (admin, manager, viewer, service)
   - **Email**: tu-email@ejemplo.com
   - **Contraseña**: mínimo 6 caracteres
5. Hacer clic en "Crear Cuenta"

**¡Ahora el SQL debería funcionar sin errores!** 🚀
