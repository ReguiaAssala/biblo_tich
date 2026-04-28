#!/usr/bin/env pwsh
# بيبليو DZ - Quick Start Script (PowerShell)

Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "    بيبليو DZ - Quick Start"
Write-Host "════════════════════════════════════════════════════"
Write-Host ""

# Check if MySQL is available
$mysql = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Host "❌ MySQL not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure MySQL is installed and added to PATH"
    Write-Host "Then run: mysql -u root -p < database.sql"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ MySQL found" -ForegroundColor Green
Write-Host ""

# Prompt for MySQL password
$mysql_pass = Read-Host "Enter MySQL password (press Enter if none)"

# Run database script
Write-Host ""
Write-Host "Running database setup..."
Write-Host ""

if ($mysql_pass -eq "") {
    & mysql -u root < database.sql
} else {
    & mysql -u root -p$mysql_pass < database.sql
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database setup failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════"
Write-Host "🚀 Starting server on http://localhost:5000"
Write-Host "════════════════════════════════════════════════════"
Write-Host ""

npm start

Read-Host "Press Enter to exit"
