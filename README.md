# W2SYS - Professional Watch Management System

## 🎯 **Descripción del Proyecto**

**W2SYS** es un sistema profesional de gestión de relojes de lujo desarrollado con tecnologías modernas. El sistema incluye autenticación multi-nivel, gestión completa de inventario, análisis avanzado, CRM, garantías, notificaciones en tiempo real y más de 20 funcionalidades empresariales.

## 🏗️ **Arquitectura Técnica**

### **Frontend**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **Estado Global**: Redux Toolkit
- **Iconos**: Lucide React

### **Backend**
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **Tiempo Real**: Supabase Realtime
- **Seguridad**: Row Level Security (RLS)

### **APIs Externas**
- **QR Codes**: qrserver.com
- **Validación Serial**: API interna
- **Cifrado**: crypto-js (AES)

## 🔐 **Sistema de Autenticación**

### **Roles de Usuario**
1. **Admin** - Acceso completo al sistema
2. **Manager** - Gestión de productos y servicios
3. **Viewer** - Solo lectura
4. **Service** - Gestión de servicios técnicos

### **Credenciales de Prueba**
```
Admin: admin@w2sys.com / admin123
Manager: manager@w2sys.com / manager123
Viewer: viewer@w2sys.com / viewer123
Service: service@w2sys.com / service123
```

## 📊 **Funcionalidades Principales**

### **✅ Gestión de Productos**
- Información completa (Case, Modelo, Serial, Precio, etc.)
- Estados dinámicos (New, Needs, On Service, Returned, Ready, Sold, RT Vendor)
- Validación de seriales, QR codes, imágenes

### **✅ Sistema de Servicios**
- 7 tipos de servicio diferentes
- Seguimiento completo, costos, certificados

### **✅ Analytics y Reportes**
- Dashboard con métricas en tiempo real
- Reportes avanzados con exportación PDF/Excel
- Análisis por período y tendencias

### **✅ CRM Completo**
- Base de datos de clientes
- Historial de compras, puntos de lealtad
- Segmentación y campañas

### **✅ Sistema de Garantías**
- 4 tipos de garantía
- Seguimiento de vencimiento, alertas automáticas

### **✅ Notificaciones en Tiempo Real**
- Centro de notificaciones
- Push del navegador
- Configuración personalizada

### **✅ Inventario Inteligente**
- Alertas automáticas de stock
- Predicción AI de demanda
- Gestión de proveedores

### **✅ Precios Dinámicos**
- Análisis de mercado en tiempo real
- Comparación competitiva
- Recomendaciones automáticas

### **✅ Auditoría y Seguridad**
- Audit log completo con trazabilidad
- Cifrado AES de datos sensibles
- Backup automático

### **✅ Autenticación 2FA**
- Autenticación de dos factores
- Códigos de respaldo
- Historial de intentos de login

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/Manuelherrera22/W2SYS.git
cd W2SYS

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar el servidor de desarrollo
npm run dev
```

### **Variables de Entorno**
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
```

## 📋 **Scripts Disponibles**

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 🗄️ **Base de Datos**

### **Tablas Principales**
- `rolex_products` - Productos principales
- `service_records` - Registros de servicio
- `user_profiles` - Perfiles de usuario
- `audit_logs` - Logs de auditoría
- `system_backups` - Backups del sistema
- `system_alerts` - Alertas del sistema
- `notification_rules` - Reglas de notificación

## 📱 **Interfaz de Usuario**

### **Diseño**
- Tema oscuro elegante
- Diseño responsive
- Navegación intuitiva
- Componentes modernos
- Animaciones suaves

### **Secciones Principales**
1. **Analytics** - Dashboard y métricas
2. **Productos** - Gestión de inventario
3. **Servicios** - Gestión de servicios
4. **Reportes Avanzados** - Análisis detallado
5. **Clientes (CRM)** - Gestión de clientes
6. **Garantías** - Sistema de garantías
7. **Notificaciones** - Centro de alertas
8. **Inventario Inteligente** - Gestión avanzada
9. **Precios Dinámicos** - Análisis de precios
10. **Autenticación 2FA** - Configuración de seguridad
11. **Audit Log** - Registro de auditoría
12. **Configuración** - Ajustes del sistema

## 🔧 **Configuración de Supabase**

### **SQL Schema**
Ejecutar los siguientes archivos SQL en Supabase:
- `supabase-schema-clean.sql` - Esquema principal
- `supabase-storage-setup.sql` - Configuración de almacenamiento
- `supabase-audit-logs-setup.sql` - Configuración de audit logs

### **RLS Policies**
El sistema incluye políticas de seguridad Row Level Security (RLS) para proteger los datos.

## 📈 **Rendimiento y Escalabilidad**

### **Optimizaciones**
- ✅ Lazy loading de componentes
- ✅ Caché de datos
- ✅ Compresión de imágenes
- ✅ Optimización de consultas
- ✅ CDN para assets

### **Escalabilidad**
- ✅ Arquitectura modular
- ✅ Base de datos escalable
- ✅ Caché distribuido
- ✅ Load balancing
- ✅ Microservicios

## 🛠️ **Mantenimiento y Soporte**

### **Monitoreo**
- ✅ Logs de sistema
- ✅ Métricas de rendimiento
- ✅ Alertas de error
- ✅ Health checks
- ✅ Uptime monitoring

### **Backup y Recuperación**
- ✅ Backup automático diario
- ✅ Backup manual bajo demanda
- ✅ Recuperación granular
- ✅ Versionado de datos
- ✅ Disaster recovery

## 📚 **Documentación Adicional**

- `DOCUMENTACION-COMPLETA-SISTEMA.md` - Documentación técnica completa
- `TEST-SISTEMA-EXITOSO.md` - Resultados de pruebas del sistema
- `SQL-CORREGIDO-USUARIOS.md` - Instrucciones para crear usuarios

## 🎯 **Roadmap Futuro**

### **Próximas Funcionalidades**
- [ ] App móvil nativa
- [ ] Integración con marketplaces
- [ ] IA para recomendaciones
- [ ] Blockchain para autenticidad
- [ ] API pública para terceros
- [ ] Integración con contabilidad
- [ ] Sistema de puntos de lealtad avanzado
- [ ] Análisis predictivo avanzado

## 📞 **Soporte y Contacto**

### **Información del Sistema**
- **Versión**: 1.0.0
- **Última actualización**: 2025-01-30
- **Desarrollado por**: W2SYS Team
- **Tecnologías**: Next.js, Supabase, TypeScript

## ✅ **Estado Actual**

**El sistema W2SYS está completamente funcional y listo para uso en producción.**

### **Funcionalidades Implementadas** ✅
- ✅ Autenticación multi-nivel
- ✅ Gestión completa de productos
- ✅ Sistema de servicios
- ✅ Analytics y reportes
- ✅ CRM de clientes
- ✅ Sistema de garantías
- ✅ Notificaciones en tiempo real
- ✅ Inventario inteligente
- ✅ Precios dinámicos
- ✅ Autenticación 2FA
- ✅ Audit log completo
- ✅ Backup automático
- ✅ Validación de seriales
- ✅ Cifrado de datos
- ✅ Interfaz moderna

---

**🎉 ¡W2SYS - El sistema de gestión de relojes más completo y avanzado! 🎉**