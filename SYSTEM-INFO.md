# Watch Management System - W2SYS Rolex Products

## 📋 Descripción

Este sistema es una **réplica exacta** de la interfaz y lógica del sistema W2SYS para gestión de productos Rolex.

Basado en: `https://w2sys.net/dashboard/store/products_rolex/new`

## 🎯 Características Implementadas

### Formulario de Producto Rolex

El formulario incluye **exactamente** los mismos campos que el sistema original:

#### Campos de Texto
1. **Case** - Caja del reloj
2. **Model** - Modelo (campo con estilo readonly/disabled)
3. **Material** - Material (campo con estilo readonly/disabled)
4. **Bezel** * - Bisel (requerido)
5. **Brazalete** - Pulsera/correa
6. **Provider** - Proveedor
7. **Serial** * - Número de serie (requerido, **UPPERCASE automático**)
8. **Year** - Año (campo con estilo readonly/disabled)
9. **End Piece code** - Código de pieza final
10. **Movement number** - Número de movimiento
11. **Cost** * - Costo (requerido)
12. **Price** - Precio
13. **Description** - Descripción (textarea)

#### Checkboxes
- ✅ **Card** - Tarjeta
- ✅ **Papers** - Papeles
- ✅ **Services papers** - Papeles de servicio
- ✅ **Has box** - Tiene caja
- ✅ **Third party inventory** - Inventario de terceros

#### Funcionalidades
- 📷 **Upload de imagen** - "Imagen In"
- 💾 **Submit** - Guardar producto
- ❌ **Close** - Cerrar formulario

### Interfaz

#### Sidebar (W2SYS)
- **Logo**: W2SYS
- **Menú**:
  - Products (activo)
  - Inventory
  - Tasks
  - Settings

#### Header
- **Usuario**: Newton / Welcome
- **Dropdown**: Password, Log Out
- **Mobile**: Botón hamburguesa para sidebar

## 🎨 Estilos

El sistema utiliza los **mismos estilos y colores** del original:

### Colores Personalizados
```css
--boxdark: Fondo oscuro de cajas
--boxdark-2: Fondo oscuro secundario
--bodydark: Texto claro en modo oscuro
--bodydark1: Texto secundario
--bodydark2: Texto terciario
--stroke: Bordes
--graydark: Gris oscuro
--blueSecondary: Azul para focus
```

### Clases Custom
- `w-72.5` - Ancho del sidebar
- `h-5.5`, `w-5.5` - Tamaños específicos
- `w-62.5` - Ancho de dropdown
- `z-9999`, `z-999` - Z-index altos
- `text-title-md2` - Tamaño de título

## 🔧 Lógica del Formulario

### Validación
- **Serial**: Se convierte automáticamente a mayúsculas
- **Campos requeridos**: Case, Bezel, Serial, Cost
- **Tipos de datos**: 
  - Cost y Price son numéricos
  - Checkboxes son booleanos
  - El resto son strings

### Almacenamiento
- Los productos se guardan en **LocalStorage**
- Key: `rolex_products`
- Formato: JSON array de objetos RolexProduct

### Estructura de Datos
```typescript
interface RolexProduct {
  id: string;
  case: string;
  model: string;
  material: string;
  bezel: string;
  brazalete: string;
  provider: string;
  serial: string;  // uppercase
  year: string;
  end_piece_code: string;
  movement_number: string;
  cost: number;
  price: number;
  description: string;
  in_card: boolean;
  in_papers: boolean;
  in_services_papers: boolean;
  in_has_box: boolean;
  in_third_party_inventory: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 📂 Estructura de Archivos

```
├── components/
│   ├── RolexDashboard.tsx      # Dashboard principal con sidebar y header
│   └── RolexProductForm.tsx    # Formulario exacto del HTML original
├── lib/
│   └── types-rolex.ts          # Definiciones de tipos
├── app/
│   ├── globals.css             # Estilos con colores W2SYS
│   └── page.tsx                # Página principal
└── tailwind.config.js          # Config con colores personalizados
```

## 🚀 Uso

### Desarrollo Local
```bash
npm install
npm run dev
```

### Producción
```bash
npm run build
```

## ✅ Características Replicadas

- ✅ Estructura de sidebar idéntica
- ✅ Header con usuario y dropdown
- ✅ Formulario con todos los campos originales
- ✅ Estilos y colores exactos
- ✅ Grid de 2 columnas en desktop
- ✅ Responsive para mobile
- ✅ Serial en uppercase automático
- ✅ Campos readonly con estilo especial (bg-slate-200)
- ✅ Checkboxes con labels
- ✅ Botones Submit y Close
- ✅ Upload de imagen
- ✅ Breadcrumb (Dashboard / Add Product)

## 📝 Notas Importantes

1. **Serial Number**: El campo serial se convierte automáticamente a mayúsculas mientras el usuario escribe.

2. **Campos Readonly**: Model, Material y Year tienen un estilo especial `bg-slate-200` para indicar que son de solo lectura o auto-rellenados.

3. **Validación**: El formulario requiere obligatoriamente: Bezel, Serial y Cost.

4. **Persistencia**: Todos los productos se guardan en LocalStorage del navegador.

5. **Responsive**: El sistema es completamente responsive:
   - Desktop: Sidebar fijo, grid de 2 columnas
   - Mobile: Sidebar oculto con botón hamburguesa, grid de 1 columna

## 🎯 Próximas Funcionalidades

- [ ] Listado de productos agregados
- [ ] Edición de productos existentes
- [ ] Eliminación de productos
- [ ] Búsqueda y filtros
- [ ] Exportación a PDF/Excel
- [ ] Integración con API backend
- [ ] Autenticación de usuarios

## 📧 Soporte

Sistema basado en W2SYS - Jorge Méndez / Programandoweb

---

**Este sistema mantiene la lógica EXACTA del formulario original de w2sys.net**



