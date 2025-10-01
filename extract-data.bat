@echo off
echo ============================================================
echo    Extrayendo Datos de Excel
echo ============================================================
echo.

echo Ejecutando script de extraccion...
node scripts/extract-excel-data.js

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo    EXITO! Datos extraidos correctamente
    echo ============================================================
    echo.
    echo Los datos de tus Excel han sido convertidos a TypeScript.
    echo.
    echo Ahora puedes ejecutar: npm run dev
    echo.
) else (
    echo.
    echo ============================================================
    echo    Error al extraer datos
    echo ============================================================
    echo.
    echo Verifica que los archivos Excel existan en Datosytest/
    echo.
)

pause



