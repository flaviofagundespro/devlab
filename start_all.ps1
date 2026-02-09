# DevLab - Sistema Modular de Automação e Mídia
# Menu interativo para iniciar apenas os serviços necessários

$ErrorActionPreference = "Stop"

# Função para desenhar o menu
function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         DevLab - Sistema Modular         ║" -ForegroundColor Cyan
    Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║                                          ║" -ForegroundColor Cyan
    Write-Host "║  1. 🚀 Full Stack (Tudo)                 ║" -ForegroundColor White
    Write-Host "║  2. 🎬 Video Downloader Only             ║" -ForegroundColor White
    Write-Host "║  3. 🎨 Image Generator Only              ║" -ForegroundColor White
    Write-Host "║  4. 🕷️  Web Scraper Only                  ║" -ForegroundColor White
    Write-Host "║  5. ⚙️  Custom (escolher serviços)       ║" -ForegroundColor White
    Write-Host "║  6. ❌ Sair                               ║" -ForegroundColor White
    Write-Host "║                                          ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# Função para iniciar um serviço
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [int]$Port
    )

    Write-Host "🔄 Iniciando $Name (porta $Port)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\$Path'; $Command" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Função para mostrar resumo dos serviços iniciados
function Show-Summary {
    param([array]$Services)

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║    ✅ Serviços Iniciados com Sucesso     ║" -ForegroundColor Green
    Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green

    foreach ($service in $Services) {
        Write-Host "║  $($service.PadRight(38)) ║" -ForegroundColor Cyan
    }

    Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 Janelas separadas foram abertas para cada serviço" -ForegroundColor White
    Write-Host "🛑 Para parar tudo: .\stop_apibr2.ps1" -ForegroundColor Yellow
    Write-Host ""
}

# Perfis de inicialização
function Start-FullStack {
    Write-Host ""
    Write-Host "🚀 Iniciando Full Stack..." -ForegroundColor Green
    Write-Host ""

    Start-Service -Name "Backend Node.js" -Path "backend" -Command "npm start" -Port 3000
    Start-Service -Name "Python Image Server" -Path "integrations" -Command "python ultra_optimized_server.py" -Port 5001
    Start-Service -Name "Video Downloader" -Path "integrations" -Command "python instagram_server.py" -Port 5002

    # Frontend - verificar node_modules
    if (!(Test-Path "frontend\node_modules")) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
    }

    Start-Service -Name "Frontend React" -Path "frontend" -Command "npm run dev" -Port 5173

    Show-Summary @(
        "Backend:        http://localhost:3000",
        "Image Server:   http://localhost:5001",
        "Video Download: http://localhost:5002",
        "Frontend:       http://localhost:5173"
    )
}

function Start-VideoDownloader {
    Write-Host ""
    Write-Host "🎬 Iniciando Video Downloader..." -ForegroundColor Green
    Write-Host ""

    Start-Service -Name "Backend Node.js" -Path "backend" -Command "npm start" -Port 3000
    Start-Service -Name "Video Downloader" -Path "integrations" -Command "python instagram_server.py" -Port 5002

    # Frontend - verificar node_modules
    if (!(Test-Path "frontend\node_modules")) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
    }

    Start-Service -Name "Frontend React" -Path "frontend" -Command "npm run dev" -Port 5173

    Show-Summary @(
        "Backend:        http://localhost:3000",
        "Video Download: http://localhost:5002",
        "Frontend:       http://localhost:5173"
    )
}

function Start-ImageGenerator {
    Write-Host ""
    Write-Host "🎨 Iniciando Image Generator..." -ForegroundColor Green
    Write-Host ""

    Start-Service -Name "Backend Node.js" -Path "backend" -Command "npm start" -Port 3000
    Start-Service -Name "Python Image Server" -Path "integrations" -Command "python ultra_optimized_server.py" -Port 5001

    # Frontend - verificar node_modules
    if (!(Test-Path "frontend\node_modules")) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
    }

    Start-Service -Name "Frontend React" -Path "frontend" -Command "npm run dev" -Port 5173

    Show-Summary @(
        "Backend:      http://localhost:3000",
        "Image Server: http://localhost:5001",
        "Frontend:     http://localhost:5173"
    )
}

function Start-WebScraper {
    Write-Host ""
    Write-Host "🕷️  Iniciando Web Scraper..." -ForegroundColor Green
    Write-Host ""

    Start-Service -Name "Backend Node.js" -Path "backend" -Command "npm start" -Port 3000

    Show-Summary @(
        "Backend:      http://localhost:3000",
        "API Docs:     http://localhost:3000/api/docs"
    )
}

function Start-Custom {
    Write-Host ""
    Write-Host "⚙️  Modo Custom - Escolha os serviços" -ForegroundColor Green
    Write-Host ""

    $services = @()

    # Backend (sempre necessário)
    Write-Host "✅ Backend Node.js será iniciado (obrigatório)" -ForegroundColor Yellow
    Start-Service -Name "Backend Node.js" -Path "backend" -Command "npm start" -Port 3000
    $services += "Backend:        http://localhost:3000"

    # Perguntar pelos outros serviços
    Write-Host ""
    $startImageGen = Read-Host "Iniciar Image Generator? (s/n)"
    if ($startImageGen -eq "s") {
        Start-Service -Name "Python Image Server" -Path "integrations" -Command "python ultra_optimized_server.py" -Port 5001
        $services += "Image Server:   http://localhost:5001"
    }

    $startVideoDown = Read-Host "Iniciar Video Downloader? (s/n)"
    if ($startVideoDown -eq "s") {
        Start-Service -Name "Video Downloader" -Path "integrations" -Command "python instagram_server.py" -Port 5002
        $services += "Video Download: http://localhost:5002"
    }

    $startFrontend = Read-Host "Iniciar Frontend? (s/n)"
    if ($startFrontend -eq "s") {
        if (!(Test-Path "frontend\node_modules")) {
            Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
            Set-Location frontend
            npm install
            Set-Location ..
        }
        Start-Service -Name "Frontend React" -Path "frontend" -Command "npm run dev" -Port 5173
        $services += "Frontend:       http://localhost:5173"
    }

    Show-Summary $services
}

# Loop principal do menu
while ($true) {
    Show-Menu
    $choice = Read-Host "Escolha uma opção (1-6)"

    switch ($choice) {
        "1" { Start-FullStack; break }
        "2" { Start-VideoDownloader; break }
        "3" { Start-ImageGenerator; break }
        "4" { Start-WebScraper; break }
        "5" { Start-Custom; break }
        "6" {
            Write-Host ""
            Write-Host "👋 Até logo!" -ForegroundColor Cyan
            Write-Host ""
            exit
        }
        default {
            Write-Host ""
            Write-Host "❌ Opção inválida! Pressione Enter para tentar novamente..." -ForegroundColor Red
            Read-Host
        }
    }

    if ($choice -in @("1", "2", "3", "4", "5")) {
        break
    }
}
