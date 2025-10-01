# ⚡ Guía Rápida: Importar tus Excel de Relojes

## 🚀 3 Pasos Simples

### Paso 1: Instalar Dependencias

```powershell
npm install
```

Esto instalará la librería `xlsx` que permite leer archivos Excel.

### Paso 2: Preparar tu Excel

Tu archivo Excel debe tener esta estructura:

#### **Primera Fila (Encabezados):**
```
Case | Model | Material | Bezel | Brazalete | Provider | Serial | Year | End Piece Code | Movement Number | Cost | Price | Description | Card | Papers | Services Papers | Has Box | Third Party
```

#### **Filas siguientes (Tus datos):**
```
114060 | Submariner | Stainless Steel | Ceramic Black | Oyster | Dealer | ABC123 | 2020 | EP001 | 3130 | 8000 | 12000 | Full set | Yes | Yes | No | Yes | No
116334 | Datejust II | Steel & Gold | Fluted | Jubilee | Dealer | XYZ789 | 2019 | EP002 | 3235 | 6000 | 9000 | Excellent | Yes | Yes | Yes | Yes | No
```

### Paso 3: Importar

1. **Abre el sistema**: `npm run dev` → `http://localhost:3000`
2. **Descarga la plantilla**: Clic en "Descargar Plantilla"
3. **Copia tus datos** a la plantilla
4. **Importa**: Clic en "Importar Excel" → Selecciona tu archivo
5. **Confirma**: Revisa y confirma

## 📋 Campos Requeridos

Solo estos 4 campos son **OBLIGATORIOS**:

1. ✅ **Case** - Número de caja (ej: `114060`)
2. ✅ **Bezel** - Tipo de bisel (ej: `Ceramic Black`)
3. ✅ **Serial** - Número de serie (ej: `ABC123`)
4. ✅ **Cost** - Costo (ej: `8000`)

**El resto son opcionales.**

## 💡 Tips para tus Excel

### ✅ Lo que SÍ funciona:

- **Columnas en cualquier orden**
- **Nombres en inglés o español**
- **Miles de filas**
- **Múltiples hojas** (usa la primera)
- **Valores vacíos** en campos opcionales
- **Fórmulas en Excel** (se importa el resultado)

### ❌ Lo que NO funciona:

- Columnas sin encabezado
- Archivos corruptos
- Formatos antiguos muy viejos

## 🔧 Si tu Excel tiene DIFERENTES columnas:

### Ejemplo: Tu Excel actual
```
REF | MODELO | PRECIO_COMPRA | PRECIO_VENTA | NUM_SERIE
```

### Solución: Renombra las columnas a:
```
Case | Model | Cost | Price | Serial
```

O crea una nueva hoja con las columnas correctas y copia los datos.

## 📊 Ejemplo Completo de Excel

He incluido un archivo `example-data.csv` que puedes:
1. Abrir en Excel
2. Ver el formato exacto
3. Reemplazar con tus datos
4. Guardar como .xlsx
5. Importar

## 🎯 Formatos Especiales

### Serial (MAYÚSCULAS)
```
Excel:    abc123
Sistema:  ABC123  ← Se convierte automáticamente
```

### Booleanos (Yes/No)
```
Aceptados:
- Yes, No
- Sí, No
- 1, 0
- X, (vacío)
- True, False
```

### Precios (Sin símbolos)
```
✅ Correcto:  8000
✅ Correcto:  8000.50
❌ Incorrecto: $8,000
❌ Incorrecto: 8.000,00 EUR
```

## 📂 Múltiples Archivos Excel

Si tienes varios archivos Excel:

### Opción 1: Importar uno por uno
```
1. Importa archivo1.xlsx
2. Confirma
3. Importa archivo2.xlsx
4. Confirma
... etc
```

### Opción 2: Combinar primero
```
1. Copia todos los datos a un solo Excel
2. Importa ese archivo único
```

## ⚠️ IMPORTANTE - Backup

**ANTES de importar:**

```
1. Exporta tus datos actuales (si tienes)
2. Guarda el Excel exportado
3. Luego importa los nuevos datos
```

Así tienes respaldo por si algo sale mal.

## 🔍 Verificar Importación

Después de importar, verifica:

1. ✅ La cantidad de productos es correcta
2. ✅ Los datos se ven bien
3. ✅ Los campos opcionales se importaron
4. ✅ Los precios son correctos

## 📞 Resolución de Problemas

### Problema: "El archivo está vacío"
**Solución**: Verifica que haya datos debajo de los encabezados

### Problema: "Formato incorrecto"
**Solución**: Usa la plantilla descargable del sistema

### Problema: "Algunos productos no se importaron"
**Solución**: Verifica que tengan los campos requeridos (Case, Bezel, Serial, Cost)

### Problema: "Los precios están mal"
**Solución**: Asegúrate de usar solo números, sin símbolos ($, comas, etc.)

---

## ✅ Checklist antes de Importar:

- [ ] Instalé las dependencias (`npm install`)
- [ ] Descargué la plantilla del sistema
- [ ] Mi Excel tiene los encabezados correctos
- [ ] Los campos requeridos están llenos
- [ ] Los precios son solo números
- [ ] Guardé el archivo como .xlsx
- [ ] Hice backup de mis datos actuales

---

**¡Listo! Ahora puedes importar todos tus Excel de relojes al sistema!** 📊✨

**¿Tienes tus archivos Excel listos? Compárteme cómo están estructurados y te ayudo a mapearlos correctamente.**



