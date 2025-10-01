# 🔧 Scripts de Utilidad

## extract-excel-data.js

Script para extraer TODOS los datos de los archivos Excel en la carpeta `Datosytest/`.

### Uso:

```bash
node scripts/extract-excel-data.js
```

### Lo que hace:

1. ✅ Lee todos los archivos Excel en `Datosytest/`
2. ✅ Extrae los datos de cada uno
3. ✅ Genera archivos TypeScript en `lib/data/`
4. ✅ Muestra un resumen de cada archivo

### Archivos que genera:

```
lib/data/
├── rolex-cases-data.ts      - Datos de Rolex Case.xlsx
├── rolex-models-data.ts     - Datos de Rolex Models.xlsx
└── rolex-bracelets-data.ts  - Datos de Rolex Bracelets.xlsx
```

### Requisitos:

```bash
# Instalar dependencias primero
npm install
```

### Ejemplo de salida:

```
📊 Extrayendo datos de archivos Excel...

📂 Leyendo: Datosytest/Rolex Case.xlsx
   ✅ 150 filas extraídas
   📋 Columnas: Case, Model, Size, Material
   
📂 Leyendo: Datosytest/Rolex Models.xlsx
   ✅ 75 filas extraídas
   📋 Columnas: Model, Description, Movement
   
💾 Guardando datos extraídos...
✅ Guardado: lib/data/rolex-cases-data.ts (150 registros)
✅ Guardado: lib/data/rolex-models-data.ts (75 registros)

🎉 ¡Datos extraídos exitosamente!
```

### Después de ejecutar:

Los archivos TypeScript generados estarán listos para usar en tu aplicación:

```typescript
import { ROLEX_CASES } from '@/lib/data/rolex-cases-data';
import { ROLEX_MODELS_DATA } from '@/lib/data/rolex-models-data';
import { ROLEX_BRACELETS_DATA } from '@/lib/data/rolex-bracelets-data';

// Usar los datos...
```



