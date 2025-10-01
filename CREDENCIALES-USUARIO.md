# 🔐 CREDENCIALES DE USUARIO - SISTEMA W2SYS

## 📋 **CONFIGURACIÓN ACTUAL**

### **Supabase Configuration**
- **URL**: `https://wverkbbgofndagwekaap.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU4NzcsImV4cCI6MjA3NDkwMTg3N30.rwcM7tcbSEFtIlQ6TDFkiEIguW2VUT8ba01fQzTehKQ`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZXJrYmJnb2ZuZGFnd2VrYWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMyNTg3NywiZXhwIjoyMDc0OTAxODc3fQ.VvvBZXaihtbnrxyGmFz7hWWcWFWRfBvpxWwhy2HIx_c`

## 👤 **CREAR USUARIOS**

### **Opción 1: Crear Usuario desde la Interfaz**
1. Abrir el sistema en http://localhost:3003
2. Hacer clic en "Iniciar Sesión" 
3. Cambiar a "Crear Cuenta"
4. Llenar los datos:
   - **Nombre Completo**: Tu nombre
   - **Rol**: Seleccionar (admin, manager, viewer, service)
   - **Email**: tu-email@ejemplo.com
   - **Contraseña**: mínimo 6 caracteres

### **Opción 2: Crear Usuario desde Supabase Dashboard**
1. Ir a https://supabase.com/dashboard
2. Seleccionar el proyecto `wverkbbgofndagwekaap`
3. Ir a Authentication > Users
4. Hacer clic en "Add user"
5. Ingresar email y contraseña
6. Confirmar el email

## 🔑 **CREDENCIALES DE PRUEBA**

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

## 🚀 **INSTRUCCIONES DE ACCESO**

### **Paso 1: Ejecutar SQL en Supabase**
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

### **Paso 2: Crear Usuarios de Prueba**
```sql
-- Crear usuarios de prueba (ejecutar en Supabase SQL Editor)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', crypt('manager123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', crypt('viewer123', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', crypt('service123', gen_salt('bf')), NOW(), NOW(), NOW());

-- Crear perfiles de usuario
INSERT INTO user_profiles (id, email, full_name, role, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@w2sys.com', 'Administrador', 'admin', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'manager@w2sys.com', 'Manager', 'manager', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'viewer@w2sys.com', 'Viewer', 'viewer', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'service@w2sys.com', 'Service', 'service', NOW(), NOW());
```

### **Paso 3: Acceder al Sistema**
1. Abrir http://localhost:3003
2. Hacer clic en "Iniciar Sesión"
3. Usar cualquiera de las credenciales de arriba
4. ¡Disfrutar del sistema completo!

## 🎯 **ROLES Y PERMISOS**

### **Admin**
- ✅ Acceso completo a todas las funciones
- ✅ Gestión de usuarios
- ✅ Configuración del sistema
- ✅ Reportes avanzados

### **Manager**
- ✅ Gestión de productos
- ✅ Edición de inventario
- ✅ Reportes básicos
- ❌ Gestión de usuarios

### **Viewer**
- ✅ Solo lectura
- ✅ Ver productos e inventario
- ❌ No puede editar nada

### **Service**
- ✅ Gestión de servicios
- ✅ Actualización de estados
- ✅ Trabajo con garantías
- ❌ No puede editar productos

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Si no puedes iniciar sesión:**
1. Verificar que el SQL de RLS se ejecutó correctamente
2. Verificar que los usuarios existen en Supabase
3. Verificar que el email está confirmado
4. Intentar crear un nuevo usuario desde la interfaz

### **Si hay errores de permisos:**
1. Ejecutar el SQL de permisos nuevamente
2. Verificar que RLS está deshabilitado
3. Revisar los logs de Supabase

**¡El sistema está listo para usar con estas credenciales!** 🚀
