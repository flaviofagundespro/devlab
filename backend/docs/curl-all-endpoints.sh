#!/bin/bash

# ========================================
# APIBR2 - Todos os Endpoints Funcionais
# Para importar no n8n HTTP Request node
# ========================================

# 1. HEALTH CHECK
echo "=== 1. HEALTH CHECK ==="
curl -X GET "http://localhost:3000/api/health" \
  -H "Accept: application/json"

# 2. API INFO
echo -e "\n=== 2. API INFO ==="
curl -X GET "http://localhost:3000/api/info" \
  -H "Accept: application/json"

# 3. METRICS
echo -e "\n=== 3. METRICS ==="
curl -X GET "http://localhost:3000/api/metrics" \
  -H "Accept: application/json"

# 4. SCRAPING BÁSICO
echo -e "\n=== 4. SCRAPING BÁSICO ==="
curl -X POST "http://localhost:3000/api/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "strategy": "basic",
    "url": "https://httpbin.org/html",
    "selectors": {
      "title": {
        "query": "h1"
      },
      "links": {
        "query": "a",
        "attribute": "href",
        "multiple": true
      }
    }
  }'

# 5. SCRAPING JAVASCRIPT
echo -e "\n=== 5. SCRAPING JAVASCRIPT ==="
curl -X POST "http://localhost:3000/api/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "strategy": "javascript",
    "url": "https://httpbin.org/html",
    "script": "document.querySelector(\"h1\").textContent.trim()"
  }'

# 6. SCREENSHOT
echo -e "\n=== 6. SCREENSHOT ==="
curl -X POST "http://localhost:3000/api/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "strategy": "screenshot",
    "url": "https://httpbin.org/html",
    "screenshotOptions": {
      "fullPage": false,
      "type": "png"
    }
  }'

# 7. SCREENSHOT JPEG
echo -e "\n=== 7. SCREENSHOT JPEG ==="
curl -X POST "http://localhost:3000/api/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "strategy": "screenshot",
    "url": "https://httpbin.org/html",
    "screenshotOptions": {
      "fullPage": false,
      "type": "jpeg",
      "quality": 90
    }
  }'

# 8. BROWSER POOL STATS
echo -e "\n=== 8. BROWSER POOL STATS ==="
curl -X GET "http://localhost:3000/api/scrape/stats" \
  -H "Accept: application/json"

# 9. YOUTUBE SCRAPING
echo -e "\n=== 9. YOUTUBE SCRAPING ==="
curl -X POST "http://localhost:3000/api/youtube/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "channelUrl": "https://www.youtube.com/@thiagocalimanIA",
    "maxResults": 5,
    "sort": "popular",
    "enableOCR": false
  }'

# 10. AUDIO GENERATION
echo -e "\n=== 10. AUDIO GENERATION ==="
curl -X POST "http://localhost:3000/api/audio/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "text": "Olá, este é um teste de geração de áudio com a API APIBR2!",
    "voice": "alloy",
    "model": "tts-1"
  }'

# 11. IMAGE GENERATION - FLUX
echo -e "\n=== 11. IMAGE GENERATION - FLUX ==="
curl -X POST "http://apibr.giesel.com.br:3000/api/v1/image/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "prompt": "Um gato fofo sentado em um jardim colorido",
    "model": "FLUX.1-dev",
    "size": "1024x1024"
  }'

# 12. IMAGE GENERATION - STABLE DIFFUSION 3.5
echo -e "\n=== 12. IMAGE GENERATION - STABLE DIFFUSION 3.5 ==="
curl -X POST "http://apibr.giesel.com.br:3000/api/v1/image/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "prompt": "Um gato fofo sentado em um jardim colorido",
    "model": "stabilityai/stable-diffusion-3.5-large",
    "size": "1024x1024"
  }'

# 13. VIDEO GENERATION
echo -e "\n=== 13. VIDEO GENERATION ==="
curl -X POST "http://localhost:3000/api/v1/video/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "prompt": "Um gato brincando com uma bola no jardim",
    "model": "stabilityai/stable-diffusion-3.5-large",
    "duration": 5
  }'

# 14. STUDIO PROJECTS
echo -e "\n=== 14. STUDIO PROJECTS ==="
curl -X GET "http://localhost:3000/api/v1/studio/projects" \
  -H "Accept: application/json"

# ========================================
# EXEMPLOS PARA N8N
# ========================================

echo -e "\n=== EXEMPLOS PARA N8N ==="
echo "Para usar no n8n, copie apenas o comando curl específico que você precisa."
echo "Exemplo para JavaScript scraping:"
echo 'curl -X POST "http://localhost:3000/api/scrape" -H "Content-Type: application/json" -d '"'"'{"strategy": "javascript", "url": "https://example.com", "script": "document.title"}'"'"'' 