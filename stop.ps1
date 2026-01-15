# Stop all services
Write-Host "🛑 Stopping AI Chat Dashboard services..." -ForegroundColor Red

# Stop Node.js processes (Frontend & Backend)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Stopped Frontend & Backend" -ForegroundColor Yellow

# Stop Python processes (AI Service)
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Stopped AI Service" -ForegroundColor Yellow

Write-Host ""
Write-Host "✨ All services stopped!" -ForegroundColor Green
