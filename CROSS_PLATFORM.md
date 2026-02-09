# Cross-Platform Compatibility Guide

## Overview

DevLab is designed to work seamlessly on **Windows** and **Linux** (Ubuntu/Debian). This guide explains platform-specific differences and how to get optimal performance on each OS.

## Quick Start by Platform

### Windows
```powershell
# Clone the repository
git clone <your-repo-url>
cd DevLab

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd integrations && python -m pip install -r requirements.txt && cd ..

# Start all services
.\start_all.ps1
```

### Linux (Ubuntu/Debian)
```bash
# Clone the repository
git clone <your-repo-url>
cd DevLab

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd integrations && python3 -m pip install -r requirements.txt && cd ..

# Start all services
chmod +x start_all.sh
./start_all.sh
```

## GPU Acceleration

### Linux + AMD GPU (Recommended for Production)
- **Best performance**: 6-7s for 512x512, ~30s for 768x768
- **Requirements**: AMD GPU + ROCm drivers
- Install ROCm: https://rocm.docs.amd.com/
- Install PyTorch with ROCm:
  ```bash
  pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7
  ```

### Linux + NVIDIA GPU
- **Great performance**: Similar to AMD ROCm
- **Requirements**: NVIDIA GPU + CUDA drivers
- Install PyTorch with CUDA:
  ```bash
  pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
  ```

### Windows + AMD GPU
- **Limited support**: DirectML (slower than ROCm)
- **Performance**: ~30s for 512x512 (CPU-like speed)
- Install DirectML:
  ```powershell
  pip install torch-directml
  ```
- Note: DirectML is detected automatically but may not be faster than CPU

### Windows + NVIDIA GPU
- **Good support**: CUDA works on Windows
- Install PyTorch with CUDA:
  ```powershell
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
  ```

### CPU Only (Fallback)
- **Works everywhere**: No GPU required
- **Performance**: ~30-40s for 512x512 at 10-15 steps
- The server auto-detects and falls back to CPU if no GPU available

## Environment Variables

### Force CPU Mode (Development/Testing)
```bash
# Linux/Mac
export FORCE_CPU=true

# Windows PowerShell
$env:FORCE_CPU="true"

# Windows CMD
set FORCE_CPU=true
```

### Prefer CPU Mode (Skip DirectML on Windows)
Useful on Windows if DirectML is slower than CPU:
```powershell
$env:PREFER_CPU="true"
```

## Path Handling

All code uses **Node.js `path` module** or **Python `pathlib`** for cross-platform path handling:

```javascript
// ✅ Good (works everywhere)
const filepath = path.join(PROJECT_ROOT, 'integrations', 'downloads', filename);

// ❌ Bad (breaks on Windows)
const filepath = PROJECT_ROOT + '/integrations/downloads/' + filename;
```

```python
# ✅ Good (works everywhere)
from pathlib import Path
output_dir = Path("generated_images")
filepath = output_dir / f"{filename}.png"

# ❌ Bad (breaks on Windows)
filepath = "generated_images/" + filename + ".png"
```

## Line Endings

- **`.gitattributes`** ensures correct line endings on checkout
- **Shell scripts (.sh)**: Always LF
- **Windows scripts (.ps1, .bat)**: Always CRLF
- **Code files (.js, .py)**: LF on both platforms

## Scripts Available

### Windows
- `start_all.ps1` - Start all services in separate windows
- `stop_devlab2.ps1` - Stop all DevLab processes
- `clean_cache.ps1` - Clear Redis and temp files
- `check_status.ps1` - Check running services

### Linux
- `start_all.sh` - Start all services in terminal tabs
- `stop_devlab2.sh` - Stop all DevLab processes
- `update_ytdlp.sh` - Update yt-dlp to latest version

## Common Issues

### Issue: "Command not found" on Linux
**Solution**: Make scripts executable
```bash
chmod +x start_all.sh stop_devlab2.sh
```

### Issue: DirectML slow on Windows
**Solution**: Use CPU mode instead
```powershell
$env:PREFER_CPU="true"
python integrations\ultra_optimized_server.py
```

### Issue: Python command not found on Linux
**Solution**: Use `python3` instead of `python`
```bash
python3 --version
python3 -m pip install -r requirements.txt
```

### Issue: npm/node version mismatch
**Solution**: Use Node.js >= 18.0.0
```bash
node --version  # Should be >= v18.0.0
```

## Docker Support (Cross-Platform)

Docker works identically on Windows and Linux:

```bash
# Development mode
docker-compose --profile dev up -d devlab-dev

# Production mode
docker-compose up -d

# With monitoring (Prometheus + Grafana)
docker-compose --profile monitoring up -d
```

## Performance Benchmarks

| Platform | Hardware | Resolution | Steps | Time |
|----------|----------|------------|-------|------|
| Linux + AMD RX 6750 XT | ROCm | 512x512 | 20 | 6-7s |
| Linux + AMD RX 6750 XT | ROCm | 768x768 | 30 | ~30s |
| Windows + AMD RX 6750 XT | CPU* | 512x512 | 12 | ~30s |
| Windows + AMD RX 6750 XT | DirectML | 512x512 | 12 | ~30s |
| Linux/Windows | CPU (Ryzen 9) | 512x512 | 10 | ~30s |

*DirectML available but not faster than CPU on some configurations

## Development Tips

### Testing on Both Platforms
If you develop on dual-boot Windows/Linux:

1. **Keep code in Git** - commit changes before switching OS
2. **Use WSL2** on Windows for Linux testing without rebooting
3. **Environment files** - maintain separate `.env.windows` and `.env.linux` if needed

### WSL2 + GPU Pass-Through (Windows)
For better GPU support on Windows, use WSL2:

```powershell
# Install WSL2 with Ubuntu
wsl --install -d Ubuntu

# Inside WSL2, install ROCm or CUDA
# GPU passes through to WSL2 automatically on Windows 11
```

## Contributing

When adding new features:
- ✅ Test on both Windows AND Linux
- ✅ Use `path.join()` / `pathlib.Path()` for file paths
- ✅ Provide both `.ps1` and `.sh` scripts if needed
- ✅ Document platform-specific behavior in code comments
- ✅ Update this guide if adding platform-specific features

## License

Same as main project license.
