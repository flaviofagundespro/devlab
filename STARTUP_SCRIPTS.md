# 🚀 Startup Scripts - DevLab

## 📋 Available Scripts

### 🎯 Main Script - Start Everything
```bash
# Windows PowerShell (Interactive Menu)
./start_all.ps1

# Windows PowerShell (Legacy - No Menu)
./start_apibr2.ps1

# Linux/Mac
./start_all.sh
```

### 🔧 Individual Scripts

#### 1. Start Node.js Backend
```bash
# Windows PowerShell
cd backend
npm start

# Linux/Mac
cd backend
npm start
```

#### 2. Start Python Image Server
```bash
# Windows
cd integrations
python ultra_optimized_server.py

# Linux/Mac
cd integrations
python3 ultra_optimized_server.py
```

#### 3. Start Video Downloader
```bash
# Windows
cd integrations
python instagram_server.py

# Linux/Mac
cd integrations
python3 instagram_server.py
```

#### 4. Start Frontend
```bash
# Windows/Linux/Mac
cd frontend
npm run dev
```

## 🎨 Interactive Menu (start_all.ps1)

The new modular startup menu allows you to choose which services to start:

```
╔══════════════════════════════════════════╗
║         DevLab - Modular System          ║
╠══════════════════════════════════════════╣
║  1. 🚀 Full Stack (Everything)           ║
║  2. 🎬 Video Downloader Only             ║
║  3. 🎨 Image Generator Only              ║
║  4. 🕷️  Web Scraper Only                  ║
║  5. ⚙️  Custom (choose services)         ║
║  6. ❌ Exit                               ║
╚══════════════════════════════════════════╝
```

### Profile Details

**1. Full Stack**
- Backend (3000)
- Image Server (5001)
- Video Downloader (5002)
- Frontend (5173)

**2. Video Downloader Only**
- Backend (3000)
- Video Downloader (5002)
- Frontend (5173)

**3. Image Generator Only**
- Backend (3000)
- Image Server (5001)
- Frontend (5173)

**4. Web Scraper Only**
- Backend (3000)

**5. Custom**
- Interactive selection of each service

## 🛠️ Maintenance Scripts

### Stop All Services
```powershell
# Windows
.\stop_apibr2.ps1
```

### Check Status
```powershell
# Windows
.\check_status.ps1
```

#### check_status.ps1 Output
```
Checking DevLab status...

Backend Node.js:
  ✅ Running (Port 3000)

Python Image Server:
  ✅ Running (Port 5001)

Video Downloader:
  ❌ Not running

Frontend:
  ✅ Running (Port 5173)
```

### Clean Cache
```powershell
# Windows
.\clean_cache.ps1
```

## 📊 Monitoring Scripts

### stop_apibr2.ps1
Gracefully stops all DevLab services by terminating processes on ports:
- 3000 (Backend)
- 5001 (Image Server)
- 5002 (Video Downloader)
- 5173 (Frontend)

```powershell
# Usage
.\stop_apibr2.ps1

# Output
Stopping DevLab services...
  Killing process node (PID: 12345) on port 3000
  Killing process python (PID: 12346) on port 5001
  Killing process python (PID: 12347) on port 5002
  Killing process node (PID: 12348) on port 5173
All services stopped.
```

### clean_cache.ps1 (Example)
```powershell
Write-Host "Cleaning DevLab cache..." -ForegroundColor Green

# Clean generated images
if (Test-Path "integrations/generated_images") {
    Remove-Item "integrations/generated_images/*" -Force -Recurse
    Write-Host "✅ Image cache cleaned" -ForegroundColor Green
}

# Clean downloads
if (Test-Path "integrations/downloads") {
    Get-ChildItem "integrations/downloads/*" | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item -Force
    Write-Host "✅ Old downloads removed" -ForegroundColor Green
}

# Clean old logs
if (Test-Path "backend/logs") {
    Get-ChildItem "backend/logs/*.log" | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item -Force
    Write-Host "✅ Old logs removed" -ForegroundColor Green
}

Write-Host "Cleanup completed!" -ForegroundColor Green
```

## 🎯 Quick Usage Guide

### 1. First Time Setup
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../integrations && pip install -r requirements.txt

# Start system with menu
cd ..
.\start_all.ps1
```

### 2. Daily Usage
```bash
# Start with interactive menu
.\start_all.ps1

# Choose your profile:
# - Full Stack for development
# - Video Downloader for personal use
# - Image Generator for AI experiments
# - Web Scraper for automation
```

### 3. Maintenance
```bash
# Check what's running
.\check_status.ps1

# Stop everything
.\stop_apibr2.ps1

# Clean cache
.\clean_cache.ps1

# Restart with menu
.\start_all.ps1
```

## 📝 Important Notes

### Windows Permissions
PowerShell scripts may require execution policy changes:
```powershell
# Run as Administrator (one-time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux/Mac Permissions
Make scripts executable:
```bash
chmod +x start_all.sh stop_apibr2.sh
```

### Dependencies
- Node.js 18+ installed
- Python 3.10+ installed
- All dependencies installed (npm install, pip install -r requirements.txt)

### Ports Used
- **3000**: Backend Node.js API
- **5001**: Python Image Server
- **5002**: Python Video Downloader
- **5173**: React Frontend
- **6379**: Redis (optional)

### Environment Variables
Create `.env` file in `backend/` directory:
```env
PORT=3000
API_KEYS=dev-key-1,dev-key-2
REDIS_URL=redis://localhost:6379
PYTHON_SERVER_URL=http://localhost:5001
VIDEO_SERVER_URL=http://localhost:5002
```

## 🔄 Script Evolution

### Old Way (start_apibr2.ps1)
Starts all services sequentially without choice:
```powershell
.\start_apibr2.ps1
# Starts: Backend → Image → Video → Frontend
```

### New Way (start_all.ps1)
Interactive menu with profiles:
```powershell
.\start_all.ps1
# Shows menu → Choose profile → Starts selected services
```

**Benefit**: Save resources by running only what you need!

## 🌐 Cross-Platform Compatibility

### Windows
- Primary focus
- PowerShell scripts (.ps1)
- Interactive menu fully supported
- All features tested

### Linux/Mac
- Bash scripts (.sh) available
- No interactive menu yet (uses legacy start_all.sh)
- All services work identically
- Better GPU performance (AMD with ROCm)

## 🎉 Success Checklist

After running scripts, you should have:
- ✅ Services running in separate windows/tabs
- ✅ Backend API accessible at http://localhost:3000
- ✅ Python services responding to health checks
- ✅ Frontend (if started) available at http://localhost:5173
- ✅ Ability to stop all services with one command

---

**🎯 Goal**: Quick and easy system startup
**✅ Status**: Scripts ready to use
**📚 Documentation**: See README.md for details
