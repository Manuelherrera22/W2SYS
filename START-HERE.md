# 🚀 EMPIEZA AQUÍ - Watch Management System

## ✅ Las dependencias ya están instaladas!

Veo que ejecutaste `npm install` correctamente.

## 📊 SIGUIENTE PASO: Extraer Datos de Excel

### Opción 1: Ejecutar el Script (.bat)

Haz doble clic en:
```
extract-data.bat
```

### Opción 2: PowerShell

Abre PowerShell en esta carpeta y ejecuta:
```powershell
npm run extract-excel
```

### Opción 3: Comando Directo

```powershell
node scripts/extract-excel-data.js
```

## 🎯 Qué hace este comando:

1. ✅ Lee `Datosytest/Rolex Case.xlsx`
2. ✅ Lee `Datosytest/Rolex Models.xlsx`
3. ✅ Lee `Datosytest/Rolex Bracelets.xlsx`
4. ✅ Genera archivos TypeScript en `lib/data/`

## ⚡ Después de extraer los datos:

```powershell
npm run dev
```

Y abre: `http://localhost:3000`

## ✨ Lo que verás funcionando:

1. **Campo Serial → Year automático**
   - Escribe cualquier serial
   - El año se calcula solo

2. **Campo Case → Autocomplete con TUS datos**
   - Escribe números de case
   - Aparecen TUS modelos de Excel

3. **Model y Material → Auto-relleno**
   - Se llenan al seleccionar Case

## 📋 Resumen:

```
✅ npm install             (YA HECHO)
⏳ npm run extract-excel   (HAZLO AHORA - usa extract-data.bat)
⏳ npm run dev             (DESPUÉS DE EXTRAER)
```

---

**Ejecuta `extract-data.bat` o `npm run extract-excel` para continuar!** 🚀



