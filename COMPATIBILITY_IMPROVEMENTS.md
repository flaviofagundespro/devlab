# Cross-Platform Compatibility Improvements

## Summary

This document tracks the improvements made to ensure APIBR2 works seamlessly on both Windows and Linux platforms.

## Date: 2026-02-06

### Files Created

1. **`.gitattributes`** - Normalizes line endings across platforms
   - Shell scripts (`.sh`) always use LF
   - Windows scripts (`.ps1`, `.bat`, `.cmd`) use CRLF
   - Code files (`.js`, `.py`, `.json`) use LF
   - Binary files marked as binary

2. **`CROSS_PLATFORM.md`** - Comprehensive cross-platform guide
   - Platform-specific installation instructions
   - GPU acceleration setup (ROCm, CUDA, DirectML, CPU)
   - Performance benchmarks and comparisons
   - Environment variable configuration
   - Path handling best practices
   - Common troubleshooting issues
   - Development tips for dual-boot setups

3. **`COMPATIBILITY_IMPROVEMENTS.md`** - This file

### Files Modified

1. **`README.md`**
   - Added cross-platform compatibility badge/notice
   - Updated prerequisites with platform-specific requirements
   - Added "Quick Start" section for both Windows and Linux
   - Separated Python installation instructions by platform
   - Updated performance benchmarks with real-world data
   - Clarified ROCm vs DirectML performance differences

2. **`CLAUDE.md`**
   - Added cross-platform compatibility notice
   - Referenced CROSS_PLATFORM.md for detailed instructions

### Code Audit Results

#### ✅ Already Cross-Platform Compatible

**Python Services:**
- ✅ `ultra_optimized_server.py` - Uses `pathlib.Path` correctly
- ✅ `instagram_server.py` - Uses `pathlib.Path` correctly
- ✅ Device detection supports DirectML (Windows), ROCm (Linux AMD), CUDA (both), MPS (macOS), CPU (all)

**Node.js Backend:**
- ✅ All path operations use `path.join()` correctly
- ✅ `studioController.js` - Proper path handling
- ✅ ES modules work on both platforms
- ✅ Package.json scripts are cross-platform

**Scripts:**
- ✅ Separate `.ps1` (Windows) and `.sh` (Linux) versions exist
- ✅ `start_all.ps1` - Windows launcher
- ✅ `start_all.sh` - Linux launcher
- ✅ `stop_apibr2.ps1` / `stop_apibr2.sh` - Platform-specific stop scripts

### Performance Insights Documented

**Linux + ROCm (AMD GPU):**
- 512×512: 6-7 seconds
- 768×768: ~30 seconds
- **Best performance for AMD hardware**

**Windows + CPU/DirectML:**
- 512×512: ~30 seconds (both CPU and DirectML show similar performance)
- DirectML offers minimal advantage over CPU on Windows for AMD GPUs
- **Recommendation**: Use Linux for production AMD deployments

**Cross-Platform (CPU):**
- Consistent ~30-40 second performance on both platforms
- Good fallback when GPU unavailable

### Best Practices Established

1. **File Paths**: Always use `path.join()` (JS) or `pathlib.Path` (Python)
2. **Scripts**: Provide both `.ps1` and `.sh` versions when needed
3. **Documentation**: Include platform-specific instructions
4. **Testing**: Test on both Windows and Linux before release
5. **Line Endings**: `.gitattributes` handles normalization automatically

### Environment Variables for Cross-Platform

- `FORCE_CPU=true` - Force CPU mode (works everywhere)
- `PREFER_CPU=true` - Skip DirectML on Windows if it's slower than CPU
- `PYTHON_SERVER_URL` - Point to remote Python server if needed

### No Breaking Changes

All improvements are backward compatible. Existing setups will continue to work without modification.

### Future Considerations

1. **WSL2 Support**: Document WSL2 + GPU pass-through for Windows users
2. **Docker**: Consider platform-specific docker-compose overrides if needed
3. **CI/CD**: Add GitHub Actions for testing on both Windows and Linux
4. **macOS**: Consider Apple Silicon (MPS) support documentation

## Conclusion

APIBR2 is now fully documented and optimized for cross-platform deployment. Anyone can clone from GitHub and run on either Windows or Linux with clear, platform-specific instructions.

The codebase was already well-structured for cross-platform use. These improvements primarily focused on:
- Documentation clarity
- Performance expectations by platform
- Setup instructions for each environment
- Git configuration for line ending normalization
