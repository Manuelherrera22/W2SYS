@echo off
echo ============================================================
echo    Watch Management System - Netlify Deployment
echo ============================================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo SUCCESS: Dependencies installed
echo.

echo [2/4] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo SUCCESS: Build completed
echo.

echo [3/4] Installing Netlify CLI...
call npm install -g netlify-cli
if %errorlevel% neq 0 (
    echo WARNING: Netlify CLI installation had issues, but continuing...
)
echo.

echo [4/4] Deploying to Netlify...
echo.
echo Setting up authentication...
set NETLIFY_AUTH_TOKEN=nfp_CyJB1R8sLhTxLvxxZp6cKq8oBPFekqffb832

echo Deploying...
call netlify deploy --prod --dir=out --auth=%NETLIFY_AUTH_TOKEN%

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo    DEPLOYMENT SUCCESSFUL!
    echo ============================================================
    echo.
    echo Your Watch Management System is now live on Netlify!
    echo Check the output above for your site URL.
    echo.
) else (
    echo.
    echo ============================================================
    echo    Deployment Notes
    echo ============================================================
    echo.
    echo If automatic deployment didn't work, you can:
    echo 1. Run: netlify deploy --prod --dir=out
    echo 2. Or drag and drop the 'out' folder to https://app.netlify.com/drop
    echo.
)

pause




