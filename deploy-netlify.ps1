# Netlify Deployment Script
# API Key: nfp_CyJB1R8sLhTxLvxxZp6cKq8oBPFekqffb832

Write-Host "=== Watch Management System - Netlify Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies." -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host ""
Write-Host "Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed." -ForegroundColor Red
    exit 1
}

# Install Netlify CLI if not present
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Set Netlify auth token
$env:NETLIFY_AUTH_TOKEN = "nfp_CyJB1R8sLhTxLvxxZp6cKq8oBPFekqffb832"

# Deploy to Netlify
Write-Host ""
Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=out --auth=$env:NETLIFY_AUTH_TOKEN

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment Successful! ===" -ForegroundColor Green
    Write-Host "Your Watch Management System is now live on Netlify!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Deployment encountered an issue. You can manually deploy by running:" -ForegroundColor Yellow
    Write-Host "netlify deploy --prod --dir=out" -ForegroundColor Cyan
}




