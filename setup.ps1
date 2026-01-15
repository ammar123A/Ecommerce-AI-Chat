# Setup Script for Windows (PowerShell)
# Run this to install all dependencies and set up the project

Write-Host "🚀 Setting up AI Chat Dashboard..." -ForegroundColor Cyan

# Frontend setup
Write-Host "`n📦 Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
} else {
    npm install
}
Set-Location ..

# Backend setup
Write-Host "`n📦 Installing Backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
} else {
    npm install
}

# Generate Prisma Client
Write-Host "`n🔨 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Set-Location ..

# AI Service setup
Write-Host "`n🐍 Setting up Python AI Service..." -ForegroundColor Yellow
Set-Location ai-service

if (Test-Path "venv") {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
} else {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Set-Location ..

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env in each service folder"
Write-Host "2. Add your OpenAI API key to ai-service/.env"
Write-Host "3. Run 'docker-compose up -d' to start all services"
Write-Host "   OR run each service manually:"
Write-Host "   - Frontend: cd frontend && npm run dev"
Write-Host "   - Backend: cd backend && npm run dev"
Write-Host "   - AI Service: cd ai-service && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload"
