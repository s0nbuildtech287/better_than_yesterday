# PowerShell run script for Better Than Yesterday Java Backend
$Host.UI.RawUI.WindowTitle = "Better Than Yesterday - Java Backend (Spring Boot 3)"
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🚀 Đang khởi động Java Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
Set-Location $PSScriptRoot
& .\gradlew.bat bootRun

