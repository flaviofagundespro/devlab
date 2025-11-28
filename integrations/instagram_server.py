import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yt_dlp
import os
from pathlib import Path
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="APIBR2 Instagram Downloader", version="1.0.0")

# Configurações
BASE_DIR = Path(__file__).parent
DOWNLOAD_DIR = BASE_DIR / "downloads"
DOWNLOAD_DIR.mkdir(exist_ok=True)

COOKIES_DIR = BASE_DIR / "cookies"
COOKIES_DIR.mkdir(exist_ok=True)
COOKIES_FILE = COOKIES_DIR / "insta_cookie.txt"

class DownloadRequest(BaseModel):
    url: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Instagram Downloader"}

@app.post("/download")
def download_video(req: DownloadRequest):
    logger.info(f"Receiving download request for: {req.url}")
    try:
        ydl_opts = {
            'outtmpl': str(DOWNLOAD_DIR / '%(title)s_%(id)s.%(ext)s'),
            'format': 'best',
            'quiet': True,
            'no_warnings': True,
        }
        
        if COOKIES_FILE.exists():
            logger.info(f"Using cookies from: {COOKIES_FILE}")
            ydl_opts['cookiefile'] = str(COOKIES_FILE)
        else:
            logger.warning("Cookies file not found. Download might fail for private/restricted content.")
            
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(req.url, download=True)
            filename = ydl.prepare_filename(info)
            
        return {
            "status": "success", 
            "filename": os.path.basename(filename), 
            "path": str(filename),
            "title": info.get('title'),
            "duration": info.get('duration')
        }
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info(f"Starting Instagram Downloader on port 5002")
    logger.info(f"Downloads will be saved to: {DOWNLOAD_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=5002)
