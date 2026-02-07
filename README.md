# APIBR2 – AI-Powered Web Scraping & Media Studio Platform

APIBR2 is a production-grade automation stack that blends high-volume web scraping, media enrichment, and AI content generation. The backend is built with Node.js/Express, while Python services handle GPU-accelerated workloads such as Stable Diffusion, Whisper, and video processing. Automations can be chained through n8n or invoked directly via REST.

> **Cross-Platform**: Fully compatible with Windows and Linux. See [CROSS_PLATFORM.md](CROSS_PLATFORM.md) for detailed setup instructions and performance comparisons.

## Architecture

```
APIBR2/
├── backend/            # Node.js REST API, queueing, scraping engines
├── integrations/       # Python workers (image/audio/video generation)
├── frontend/           # Optional dashboard (React/Vite)
├── docs/               # Deep-dive guides per subsystem
├── scripts/            # Helper scripts and PowerShell launchers
├── controllers/        # Legacy routing layer kept for compatibility
└── start_*.ps1         # Windows shortcuts for local development
```

### Core components
- **Scraping API** – Puppeteer browser pool, proxy rotation, caching, and asynchronous job tracking.
- **Media Studio API** – `/api/v1/{audio|image|video|studio}` endpoints that orchestrate the Python workers.
- **Python GPU Services** – `integrations/ultra_optimized_server.py` exposes `/generate`, `/edit`, `/benchmark`, and `/models`.
- **Automation hooks** – Built-in n8n connector (`backend/src/services/n8n_integration.js`) for multi-step pipelines.
- **Monitoring** – Prometheus metrics, structured logs, health/benchmark endpoints, and shell scripts for manual QA.

## Installation

### Prerequisites
- Node.js 18+
- Python 3.10+ (with pip)
- Redis (local or remote) for cache/job metadata
- Git
- **Windows**: PowerShell 7+
- **Linux**: Bash, chmod for script permissions
- **Optional**: CUDA (NVIDIA) or ROCm (AMD on Linux) for GPU acceleration

### Quick Start (All Platforms)

**Windows:**
```powershell
.\start_all.ps1  # Starts backend, Python services, and frontend
```

**Linux:**
```bash
chmod +x start_all.sh stop_apibr2.sh
./start_all.sh   # Starts all services in terminal tabs
```

### Backend (Node.js)
```bash
cd APIBR2/backend
cp ../env.example .env        # or set environment variables manually
npm install
npm run dev                   # watches src/ for changes
# npm start                   # production-style start
```

Key environment variables (`backend/.env`):
```
PORT=3000
API_KEYS=dev-key-1,dev-key-2        # comma-separated list required for /api/*
REDIS_URL=redis://localhost:6379
PYTHON_SERVER_URL=http://localhost:5001
BROWSER_POOL_SIZE=5
LOG_LEVEL=info
```

### Python AI services

**Windows:**
```powershell
cd APIBR2\integrations
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# For AMD GPU (DirectML - limited performance)
pip install torch-directml
# For NVIDIA GPU
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
python ultra_optimized_server.py
```

**Linux:**
```bash
cd APIBR2/integrations
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# For AMD GPU (ROCm - best performance)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7
# For NVIDIA GPU
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
# For CPU only
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
python3 ultra_optimized_server.py
```

Environment toggles (read inside `ultra_optimized_server.py`):
- `FORCE_CPU=true` – bypass DirectML/CUDA and keep everything on CPU.
- `PREFER_CPU=true` – automatically stay on CPU unless CUDA is available.
- `HUGGINGFACE_HUB_TOKEN` – unlocks gated models when needed.

### Frontend (optional)
```bash
cd APIBR2/frontend
npm install
npm run dev   # serves dashboard on http://localhost:5173
```

## Usage

### Start the stack
1. Launch Redis locally or update `REDIS_URL` to point at your instance.
2. Start the Python server (`python ultra_optimized_server.py`).
3. Start the Node.js API (`npm run dev` or `npm start`).
4. Export `API_KEYS` or place them in `.env`; use them via `x-api-key` header.

### Primary endpoints
| Capability | Route | Notes |
|------------|-------|-------|
| Health/metrics | `GET /health`, `GET /api/metrics` | Includes cache stats + Prometheus data |
| Web scraping | `POST /api/scrape`, `POST /api/scrape/async` | Supports Puppeteer strategies + async job polling |
| Job tracking | `GET /api/jobs/:id` | Retrieves async scrape status/results |
| YouTube ingestion | `POST /api/youtube/scrape`, `/video`, `/ocr` | OCR support auto-disables when Tesseract is missing |
| Media studio | `/api/v1/{audio,image,video,studio}` | Proxies to Python services or triggers n8n |
| Image AI | `POST /api/v1/image/generate` (Node) → `POST /generate` (Python) | Stable Diffusion v1.5, SDXL Turbo, DreamShaper, OpenJourney, Anything-v3 |

Authentication: every `/api/*` route expects an `x-api-key` header that matches one of the comma-separated values defined in `API_KEYS`.

## Examples

### 1. Scrape a page using Puppeteer
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

### 2. Generate an image with SDXL Turbo
```bash
curl -X POST http://localhost:3000/api/v1/image/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-1" \
  -d '{
        "prompt": "futuristic brazilian skyline at dusk, cinematic, 35mm",
        "model": "stabilityai/sdxl-turbo",
        "scheduler": "euler_a",
        "size": "768x512",
        "guidance_scale": 0.0,
        "device": "cpu"
      }'
```

### 3. Call Python server directly (bypassing Node)
```bash
curl -X POST http://localhost:5001/generate \
  -H "Content-Type: application/json" \
  -d '{
        "prompt": "ultra detailed concept art of a cyberpunk Recife street",
        "model": "runwayml/stable-diffusion-v1-5",
        "steps": 15,
        "size": "512x512"
      }'
```

## Results

### Confirmed benchmarks (post Secure Boot tuning)

| Scenario | Steps | Time | Notes |
|----------|-------|------|-------|
| First generation (Ryzen 9 7900X + RX 6750 XT DirectML) | 25 | ~44 s | Includes cold-start model load |
| Warm-up generations (same hardware) | 25 | ~18 s ⚡ | Sustained 1.32 steps/s after cache warm-up |
| DirectML baseline (before tuning) | 25 | ~44 s | Used to be bound by Secure Boot + driver overhead |
| DirectML optimized (current) | 25 | ~18 s | 2.4× faster than the previous DirectML baseline |

### Cross-hardware comparison (25 steps @ 512×512)

| Hardware / Device | Avg. time | Relative speed |
|-------------------|-----------|----------------|
| RX 6750 XT (DirectML, current build) | ~18 s | reference |
| RTX 3060 (CUDA) | ~12 s | ~1.5× faster |
| RTX 4070 (CUDA) | ~6 s | ~3× faster |
| RX 6750 XT (DirectML, before fixes) | ~44 s | 0.4× (baseline) |
| CPU Ryzen 9 7900X (no GPU) | ~45 s | matches old DirectML performance |

**Platform Performance Notes:**
- ⚡ Linux + ROCm (AMD) is 5x faster than Windows on same hardware (6-7s vs 30s for 512×512)
- 🪟 Windows DirectML shows no speed advantage over CPU for AMD GPUs
- 🐧 For production AMD deployments, use Linux with ROCm drivers
- 🟢 NVIDIA CUDA works well on both Windows and Linux
- ✅ CPU fallback provides consistent ~30s performance across all platforms
- First request downloads/loads model; subsequent requests use hot cache

## Testing
```bash
# Backend unit/integration tests
cd backend
npm test

# Python test suite (if pytest is configured)
cd ../integrations
python -m pytest

# Browser + scraping smoke tests
./test-basic.sh                # Linux/macOS
pwsh ./test-js.ps1             # Windows PowerShell scripts
```

## Monitoring & Operations
- **Prometheus metrics**: expose `/api/metrics` and scrape from your collector.
- **Logs**: backend uses winston JSON logs; Python server logs to STDOUT (redirect to `server.log` if needed).
- **Health checks**: `GET /health` (Node) and `GET /health` on the Python service include CPU/RAM usage, loaded models, and applied optimizations.
- **n8n**: configure `N8N_BASE_URL`, `N8N_API_KEY`, and `N8N_WEBHOOK_URL` to trigger automation workflows directly from controllers.
- **PowerShell helpers**: `start_apibr2.ps1`, `start_frontend.ps1`, and `start_instagram.ps1` speed up local demos.

## Additional Documentation
- `docs/IMAGE_API.md` – exhaustive parameter list for the Python image API.
- `INSTALACAO_PYTHON.md` – Windows-specific Python environment guide.
- `STARTUP_SCRIPTS.md` – explanation of the PowerShell helpers.
- `integrations/PROBLEMA_GERACAO_IMAGEM.md` – troubleshooting DirectML bottlenecks.

## Contributing
1. Fork the repository and create a feature branch.
2. Run `npm test` (backend) and `python -m pytest` (integrations) before opening a PR.
3. Follow the existing ESLint/Prettier rules and keep comments in English.

## License

This project is released under the MIT License. See `LICENSE` for full details.
