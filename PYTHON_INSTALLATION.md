# 🚀 INSTALLATION GUIDE - DevLab Media Studio

## 📋 PREREQUISITES

### 1. Check Installations:
```bash
python --version          # Should be 3.8+
pip --version            # Should be 20.0+
```

### 2. Update pip:
```bash
python -m pip install --upgrade pip
```

---

## 🔧 STEP-BY-STEP INSTALLATION

### **STEP 1: Create Virtual Environment**
```bash
# Windows
python -m venv devlab_env
devlab_env\Scripts\activate

# Linux/Mac
python3 -m venv devlab_env
source devlab_env/bin/activate
```

### **STEP 2: Install Basic Dependencies**
```bash
pip install numpy pillow requests python-dotenv
```

### **STEP 3: Install PyTorch**
```bash
# CPU only (recommended to start)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# With NVIDIA GPU (if available)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# With AMD GPU on Linux (ROCm)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7

# With AMD GPU on Windows (DirectML - limited performance)
pip install torch-directml
```

### **STEP 4: Install AI/ML Libraries**
```bash
pip install transformers diffusers accelerate
```

### **STEP 5: Install Audio Processing**
```bash
pip install librosa soundfile pydub
```

### **STEP 6: Install Image Processing**
```bash
pip install opencv-python
```

### **STEP 7: Install Video Processing**
```bash
pip install moviepy ffmpeg-python yt-dlp
```

### **STEP 8: Install Core Dependencies**
```bash
pip install fastapi uvicorn[standard]
```

### **STEP 9: Install Utilities**
```bash
pip install aiohttp pydantic loguru
```

### **STEP 10: Install Development Tools**
```bash
pip install pytest black flake8
```

---

## 🚀 QUICK INSTALLATION (ALTERNATIVE)

```bash
# Navigate to integrations folder
cd Projetos/DevLab/integrations

# Activate virtual environment (if created)
devlab_env\Scripts\activate  # Windows
source devlab_env/bin/activate  # Linux/Mac

# Install everything at once
pip install -r requirements.txt
```

---

## 🔍 INSTALLATION VERIFICATION

### Complete Test:
```bash
python -c "
import torch
import transformers
import diffusers
import librosa
import cv2
import moviepy
print('✅ All dependencies installed successfully!')
"
```

### Individual Tests:
```bash
# Test PyTorch
python -c "import torch; print(f'PyTorch: {torch.__version__}')"

# Test Transformers
python -c "import transformers; print(f'Transformers: {transformers.__version__}')"

# Test OpenCV
python -c "import cv2; print(f'OpenCV: {cv2.__version__}')"

# Test GPU availability (if applicable)
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

---

## ⚠️ TROUBLESHOOTING

### **1. FFmpeg not found:**
```bash
# Windows: Download from https://ffmpeg.org/download.html
# Linux: sudo apt install ffmpeg
# Mac: brew install ffmpeg
```

### **2. PyTorch error:**
```bash
# Uninstall and reinstall
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### **3. OpenCV error:**
```bash
# Try headless version
pip uninstall opencv-python
pip install opencv-python-headless
```

### **4. Librosa error:**
```bash
# Install system dependencies first
# Windows: pip install librosa --no-deps
# Linux: sudo apt install libsndfile1
```

### **5. DirectML slow on Windows (AMD GPU):**
DirectML may not provide significant speedup over CPU on Windows. Consider:
```bash
# Force CPU mode instead
set FORCE_CPU=true  # Windows CMD
$env:FORCE_CPU="true"  # PowerShell
python ultra_optimized_server.py
```

---

## 🎯 NEXT STEPS

### **1. Start Image Server:**
```bash
cd Projetos/DevLab/integrations
python ultra_optimized_server.py
# Server will start on http://localhost:5001
```

### **2. Start Video Downloader:**
```bash
cd Projetos/DevLab/integrations
python instagram_server.py
# Server will start on http://localhost:5002
```

### **3. Test Integrations:**
```bash
# Test image generation
.\integrations\test_simple.ps1  # Windows
./integrations/test_simple.sh   # Linux

# Test video downloads
curl -X POST http://localhost:5002/instagram/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/reel/ABC123"}'
```

---

## 📁 PROJECT STRUCTURE

```
Projetos/DevLab/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Studio controllers
│   │   ├── routes/       # API routes
│   │   └── ...
│   └── package.json
├── integrations/         # Python services
│   ├── requirements.txt  # Python dependencies
│   ├── ultra_optimized_server.py  # Image generation
│   ├── instagram_server.py        # Video downloader
│   └── ...
├── frontend/             # React interface
├── docs/                 # Documentation
└── PYTHON_INSTALLATION.md  # This file
```

---

## 🌐 AVAILABLE ENDPOINTS

### **Image Studio:**
- `POST /generate` - Generate images with Stable Diffusion
- `GET /models` - List available models
- `GET /health` - Health check

### **Video Downloader:**
- `POST /instagram/download` - Download Instagram videos
- `POST /tiktok/download` - Download TikTok videos
- `POST /youtube/download` - Download YouTube videos
- `GET /health` - Health check

### **Backend API (Node.js):**
- `POST /api/v1/image/generate` - Proxy to Python image server
- `POST /api/instagram/download` - Proxy to video downloader
- `POST /api/scrape` - Web scraping
- `GET /health` - Health check

---

## 🎉 SUCCESS!

After following this guide, you will have:
- ✅ **Node.js API** running (gateway + web scraping)
- ✅ **Python dependencies** installed
- ✅ **AI integrations** configured
- ✅ **Image generation** working (Stable Diffusion)
- ✅ **Video downloads** functional (multi-platform)

**Now you can use DevLab as a complete AI-powered media production studio!** 🚀

---

## 📊 Expected Performance

### Image Generation (512x512, 25 steps):
- CPU (Ryzen 9 7900X): ~30s
- AMD RX 6750 XT (Windows/DirectML): ~18-30s
- AMD RX 6750 XT (Linux/ROCm): ~6-7s ⚡
- NVIDIA RTX 4070 (CUDA): ~6s

### Video Downloads:
- Instagram: ~5-15s (depends on video length)
- TikTok: ~5-10s
- YouTube: ~10-60s (depends on quality and length)

---

## 🔗 Additional Resources

- [CROSS_PLATFORM.md](CROSS_PLATFORM.md) - Cross-platform setup guide
- [README.md](README.md) - Project overview
- [CLAUDE.md](CLAUDE.md) - Developer guide
- [docs/IMAGE_API.md](docs/IMAGE_API.md) - Image API parameters
