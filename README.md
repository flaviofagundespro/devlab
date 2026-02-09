# DevLab 🚀

**Modular automation and media platform with AI** — Hybrid system combining Stable Diffusion image generation, multi-platform video downloads, and professional web scraping.

<!-- Shields -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-v3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-v18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)

<!-- AI/ML Badges -->
[![Stable Diffusion](https://img.shields.io/badge/Stable_Diffusion-FF6B6B?logo=python&logoColor=white)](https://stability.ai/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?logo=puppeteer&logoColor=white)](https://pptr.dev/)

<!-- Platform Badges -->
[![Windows](https://img.shields.io/badge/Windows-0078D6?logo=windows&logoColor=white)](https://www.microsoft.com/windows)
[![Linux](https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black)](https://www.linux.org/)

---

## 🎯 Overview

DevLab is a home/professional automation stack that enables:
- 🎨 **AI image generation** (Stable Diffusion, DreamShaper, SDXL) without API limits
- 🎬 **Video downloads** from Instagram, TikTok, YouTube, Facebook and other platforms
- 🕷️ **Professional web scraping** with Puppeteer browser pool
- ⚡ **Modular interface** — start only the services you need

### ✨ Key Feature: Smart Launch Menu

Choose the ideal profile for your needs:
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

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend React (5173)                 │
│     Visual dashboard for all features           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        Backend Node.js/Express (3000)           │
│   Gateway + Scraping + Orchestration + Redis    │
└─────┬──────────────────────────┬────────────────┘
      │                          │
┌─────▼──────────────┐   ┌───────▼─────────────────┐
│  Python FastAPI    │   │  Python FastAPI         │
│  Image Server      │   │  Video Downloader       │
│  (5001)            │   │  (5002)                 │
│  - Stable Diffusion│   │  - yt-dlp               │
│  - GPU/CPU Support │   │  - Multi-platform       │
└────────────────────┘   └─────────────────────────┘
```

### Components

| Component | Technology | Port | Function |
|-----------|-----------|------|----------|
| **Backend** | Node.js/Express | 3000 | Gateway, scraping, authentication |
| **Image Server** | Python/FastAPI | 5001 | Stable Diffusion, GPU acceleration |
| **Video Downloader** | Python/yt-dlp | 5002 | Multi-platform downloads |
| **Frontend** | React/Vite | 5173 | Visual interface (optional) |
| **Cache** | Redis | 6379 | Job queue and caching |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Redis (optional, but recommended)
- Git

### Fast Installation

**Windows:**
```powershell
# 1. Clone repository
git clone https://github.com/your-username/devlab.git
cd devlab

# 2. Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings

# 3. Python Services
cd ..\integrations
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 4. Frontend (optional)
cd ..\frontend
npm install

# 5. Start everything with interactive menu
cd ..
.\start_all.ps1
```

**Linux:**
```bash
# Similar to Windows, but with adaptations:
# - source .venv/bin/activate
# - ./start_all.sh
```

---

## 💡 Use Cases

### 1. AI Image Generation
```bash
curl -X POST http://localhost:3000/api/v1/image/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-1" \
  -d '{
    "prompt": "futuristic city at sunset, cyberpunk style, 4k",
    "model": "dreamshaper-8",
    "size": "512x512",
    "steps": 25
  }'
```

**Available models:**
- `stable-diffusion-1.5` — Versatile, fast
- `dreamshaper-8` — Photographic quality
- `sdxl-turbo` — Ultra-fast (1-4 steps)
- `openjourney` — Artistic style
- `anything-v3` — Anime/illustration

### 2. Video Downloads
```bash
# Instagram Reels
curl -X POST http://localhost:3000/api/instagram/download \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-1" \
  -d '{"url": "https://www.instagram.com/reel/ABC123"}'

# TikTok, YouTube, Facebook also supported
```

### 3. Professional Web Scraping
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-1" \
  -d '{
    "url": "https://example.com",
    "strategy": "puppeteer",
    "actions": [
      {"type": "waitForSelector", "selector": "main"},
      {"type": "screenshot"}
    ]
  }'
```

---

## ⚙️ Advanced Configuration

### Environment Variables (`backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Authentication (required)
API_KEYS=dev-key-1,dev-key-2,prod-key-xyz

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Python Services
PYTHON_SERVER_URL=http://localhost:5001
VIDEO_SERVER_URL=http://localhost:5002

# Puppeteer
BROWSER_POOL_SIZE=5

# Logs
LOG_LEVEL=info
```

### Python Image Server

```bash
# NVIDIA GPU (CUDA)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# AMD GPU on Windows (DirectML - limited performance)
pip install torch-directml

# CPU only (works anywhere)
FORCE_CPU=true python ultra_optimized_server.py
```

**Expected performance (512×512, 25 steps):**
- 🖥️ CPU (Ryzen 9 7900X): ~30s
- 🟢 NVIDIA RTX 4070: ~6s
- 🔴 AMD RX 6750 XT (DirectML/Windows): ~18-30s
- ⚡ AMD RX 6750 XT (ROCm/Linux): ~6-7s

---

## 📊 Launch Profiles

### Full Stack
Starts all services: ideal for exploring all features.
```
✅ Backend (3000)
✅ Image Server (5001)
✅ Video Downloader (5002)
✅ Frontend (5173)
```

### Video Downloader Only
For those who only need to download social media videos.
```
✅ Backend (3000)
✅ Video Downloader (5002)
✅ Frontend (5173)
```

### Image Generator Only
To experiment with AI image generation.
```
✅ Backend (3000)
✅ Image Server (5001)
✅ Frontend (5173)
```

### Web Scraper Only
Minimal API for scraping and automation.
```
✅ Backend (3000)
```

### Custom
Interactively choose each service.

---

## 🛠️ Useful Scripts

```powershell
# Windows
.\start_all.ps1       # Interactive menu
.\stop_apibr2.ps1     # Stop all services
.\check_status.ps1    # Check services status

# Linux
./start_all.sh        # Start all services
./stop_apibr2.sh      # Stop everything
```

---

## 📖 Additional Documentation

- **[CLAUDE.md](CLAUDE.md)** — Complete guide for Claude Code
- **[CROSS_PLATFORM.md](CROSS_PLATFORM.md)** — Windows vs Linux setup
- **[docs/IMAGE_API.md](docs/IMAGE_API.md)** — Image API parameters
- **[INSTALACAO_PYTHON.md](INSTALACAO_PYTHON.md)** — Python/GPU troubleshooting

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test
npm run test:coverage

# Python (if pytest configured)
cd integrations
pytest

# Smoke tests
.\backend\tests\test-scraping-simple.ps1
.\integrations\test_simple.ps1
```

---

## 📈 Monitoring

- **Health checks**: `GET /health` (all services)
- **Prometheus metrics**: `GET /api/metrics`
- **Structured logs**: Winston (backend) + STDOUT (Python)
- **n8n integration**: Configure `N8N_BASE_URL` and `N8N_API_KEY`

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add: new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Stable Diffusion** — Stability AI
- **Puppeteer** — Google Chrome DevTools
- **yt-dlp** — Open source community
- **FastAPI** — Sebastián Ramírez
- **React** — Meta

---

**Made with ❤️ for home use and experimentation**
