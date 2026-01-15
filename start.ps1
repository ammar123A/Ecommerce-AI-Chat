# AI Chat Dashboard - Startup Script
Write-Host "Starting AI Chat Dashboard..." -ForegroundColor Cyan

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

$projectRoot = "C:\Users\Public\Documents\AI_Chat_Dashboard"

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting AI Service..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\ai-service'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Write-Host ""
Write-Host "All services starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend:  http://localhost:3000"
Write-Host "  AI Service: http://localhost:8000"
Write-Host ""
Write-Host "Login:" -ForegroundColor Cyan
Write-Host "  Email: admin@ecommerce.com"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "Wait 10-15 seconds then open: http://localhost:5173" -ForegroundColor Yellow
