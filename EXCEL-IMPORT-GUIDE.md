# 📊 Guía de Importación de Excel - Watch Management System

## 🎯 Cómo Importar tus Datos de Excel

### Paso 1: Descargar la Plantilla

1. Abre el sistema en tu navegador
2. Haz clic en **"Descargar Plantilla"**
3. Se descargará `rolex-import-template.xlsx`

### Paso 2: Llenar tus Datos

Abre el archivo Excel y llena tus datos siguiendo este formato:

#### Columnas del Excel:

| Columna | Tipo | Requerido | Ejemplo | Descripción |
|---------|------|-----------|---------|-------------|
| **Case** | Texto | ✅ Sí | 114060 | Número de caja del reloj |
| **Model** | Texto | No | Submariner | Modelo (se auto-completa si conoces el Case) |
| **Material** | Texto | No | Stainless Steel | Material (se auto-completa si conoces el Case) |
| **Bezel** | Texto | ✅ Sí | Ceramic Black | Tipo de bisel |
| **Brazalete** | Texto | No | Oyster | Tipo de pulsera/correa |
| **Provider** | Texto | No | Official Dealer | Proveedor |
| **Serial** | Texto | ✅ Sí | ABC123XYZ | Número de serie (se convertirá a mayúsculas) |
| **Year** | Texto/Número | No | 2020 | Año de fabricación |
| **End Piece Code** | Texto | No | EP001 | Código de pieza final |
| **Movement Number** | Texto | No | MV3130 | Número de movimiento |
| **Cost** | Número | ✅ Sí | 8000 | Costo de compra |
| **Price** | Número | No | 12000 | Precio de venta |
| **Description** | Texto | No | Full set with box and papers | Descripción detallada |
| **Card** | Sí/No | No | Yes | ¿Tiene tarjeta? (Yes/No, Sí/No, 1/0, X) |
| **Papers** | Sí/No | No | Yes | ¿Tiene papeles? |
| **Services Papers** | Sí/No | No | No | ¿Tiene papeles de servicio? |
| **Has Box** | Sí/No | No | Yes | ¿Tiene caja? |
| **Third Party** | Sí/No | No | No | ¿Inventario de terceros? |
| **Image** | URL | No | https://... | URL de la imagen |

### Paso 3: Importar el Archivo

1. Guarda tu archivo Excel
2. En el sistema, haz clic en **"Importar Excel"**
3. Selecciona tu archivo
4. Revisa la **Vista Previa** de los datos
5. Haz clic en **"Confirmar Importación"**

### Paso 4: ¡Listo!

Todos tus productos estarán cargados en el sistema.

## ✨ Características del Importador

### ✅ Validaciones Automáticas
- **Serial**: Se convierte a MAYÚSCULAS automáticamente
- **Cost/Price**: Se convierten a números
- **Booleanos**: Acepta múltiples formatos:
  - `Yes`, `No`
  - `Sí`, `No`
  - `True`, `False`
  - `1`, `0`
  - `X`, (vacío)

### ✅ Soporte Multi-idioma

Puedes usar columnas en **inglés** o **español**:

**Inglés:**
```
Case | Model | Material | Bezel | Cost | Price
```

**Español:**
```
Caja | Modelo | Material | Bisel | Costo | Precio
```

### ✅ Vista Previa

Antes de importar, verás:
- Cantidad de productos
- Tabla con los primeros 10 productos
- Datos parseados correctamente

### ✅ Exportar Datos

Puedes exportar tus productos actuales a Excel:
1. Haz clic en **"Exportar Excel"**
2. Se descarga un archivo con todos tus productos
3. Úsalo como backup o para editar masivamente

## 📋 Ejemplo de Excel:

### Opción 1: Excel Simple

```
Case      | Model       | Serial    | Bezel         | Cost  | Price
114060    | Submariner  | ABC123    | Ceramic Black | 8000  | 12000
116334    | Datejust II | XYZ789    | White Gold    | 6000  | 9000
```

### Opción 2: Excel Completo

```
Case   | Model      | Material        | Bezel  | Brazalete | Provider | Serial | Year | End Piece Code | Movement Number | Cost | Price | Description | Card | Papers | Services Papers | Has Box | Third Party
114060 | Submariner | Stainless Steel | Black  | Oyster    | Dealer   | A123   | 2020 | EP01           | 3130            | 8000 | 12000 | Full set    | Yes  | Yes    | No              | Yes     | No
```

## 🚨 Errores Comunes y Soluciones

### Error: "El archivo Excel está vacío"
**Solución**: Asegúrate de que la primera fila tenga los nombres de las columnas y que haya al menos una fila con datos.

### Error: "Formato incorrecto"
**Solución**: Descarga la plantilla y úsala como base. No cambies los nombres de las columnas.

### Datos no aparecen
**Solución**: Verifica que los campos requeridos estén llenos:
- Case
- Bezel
- Serial
- Cost

### Checkboxes no funcionan
**Solución**: Usa uno de estos valores:
- `Yes` o `No`
- `Sí` o `No`  
- `1` o `0`
- `X` o (vacío)

## 💡 Tips Avanzados

### 1. Importación Masiva

Puedes importar **cientos o miles** de productos a la vez. El sistema:
- ✅ Los procesará automáticamente
- ✅ Generará IDs únicos
- ✅ Agregará timestamps
- ✅ Los guardará en localStorage

### 2. Actualización de Datos

Para actualizar productos existentes:
1. Exporta los datos actuales
2. Edita el Excel
3. Importa de nuevo

(Nota: Esto agregará productos nuevos. Para actualizar, tendrás que limpiar primero)

### 3. Backup Regular

Recomendado:
- Exporta tus datos cada semana
- Guarda el Excel en un lugar seguro
- Así tienes backup si pierdes datos del navegador

### 4. Migración entre Navegadores

Para mover datos de un navegador a otro:
1. Exporta a Excel en el navegador original
2. Importa el Excel en el nuevo navegador

## 📊 Formato de Datos en Excel

### Tipos de Datos:

```
Texto    → Case, Model, Material, Bezel, etc.
Número   → Cost, Price, Year
Booleano → Card, Papers, Has Box, etc. (Yes/No)
URL      → Image (https://...)
```

### Valores Vacíos:

- Campos no requeridos pueden estar vacíos
- Se usarán valores por defecto:
  - Texto: cadena vacía ""
  - Número: 0
  - Booleano: false

## 🔧 Solución de Problemas

### El importador no aparece
**Solución**: Ejecuta `npm install` para instalar la librería `xlsx`

### Los datos no se guardan
**Solución**: Verifica que localStorage esté habilitado en tu navegador

### Caracteres especiales (ñ, é, á, etc.)
**Solución**: Guarda el Excel como `.xlsx` (no `.xls`). El formato nuevo soporta UTF-8.

## 📞 Soporte

Si tienes problemas:
1. Descarga la plantilla y úsala exactamente como está
2. Verifica que los campos requeridos estén completos
3. Revisa la consola del navegador (F12) para ver errores detallados

---

**Con este sistema puedes importar TODOS tus datos de Excel de una vez!** 📊✨



