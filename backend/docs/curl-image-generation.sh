#!/bin/bash

# ========================================
# APIBR2 - Geração de Imagem
# Modelos: FLUX.1-dev e Stable Diffusion 3.5
# ========================================

# 1. GERAÇÃO DE IMAGEM COM FLUX
echo "=== 1. GERAÇÃO DE IMAGEM COM FLUX ==="
curl -X POST "http://localhost:3000/api/v1/image/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "prompt": "Um gato fofo sentado em um jardim colorido, estilo realista",
    "model": "FLUX.1-dev",
    "size": "1024x1024"
  }'

echo -e "\n"

# 2. GERAÇÃO DE IMAGEM COM STABLE DIFFUSION 3.5
echo "=== 2. GERAÇÃO DE IMAGEM COM STABLE DIFFUSION 3.5 ==="
curl -X POST "http://localhost:3000/api/v1/image/generate" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "prompt": "Um gato fofo sentado em um jardim colorido, estilo realista",
    "model": "stabilityai/stable-diffusion-3.5-large",
    "size": "1024x1024"
  }'

echo -e "\n"

# 3. EDIÇÃO DE IMAGEM COM STABLE DIFFUSION 3.5
echo "=== 3. EDIÇÃO DE IMAGEM COM STABLE DIFFUSION 3.5 ==="
curl -X POST "http://localhost:3000/api/v1/image/edit" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "image_url": "http://example.com/imagem_original.jpg",
    "prompt": "Adicionar um chapéu ao gato",
    "model": "stabilityai/stable-diffusion-3.5-large"
  }'

echo -e "\n"

# 4. UPSCALE DE IMAGEM COM STABLE DIFFUSION 3.5
echo "=== 4. UPSCALE DE IMAGEM COM STABLE DIFFUSION 3.5 ==="
curl -X POST "http://localhost:3000/api/v1/image/upscale" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "image_url": "http://example.com/imagem_baixa_resolucao.jpg",
    "model": "stabilityai/stable-diffusion-3.5-large"
  }'

echo -e "\n"

# ========================================
# EXEMPLOS PARA N8N
# ========================================

echo "=== EXEMPLOS PARA N8N ==="
echo "Para usar no n8n, copie apenas o comando curl específico que você precisa."
echo ""
echo "Exemplo para FLUX:"
echo 'curl -X POST "http://localhost:3000/api/v1/image/generate" -H "Content-Type: application/json" -d '"'"'{"prompt": "Um gato fofo", "model": "FLUX.1-dev", "size": "1024x1024"}'"'"''
echo ""
echo "Exemplo para Stable Diffusion 3.5:"
echo 'curl -X POST "http://localhost:3000/api/v1/image/generate" -H "Content-Type: application/json" -d '"'"'{"prompt": "Um gato fofo", "model": "stabilityai/stable-diffusion-3.5-large", "size": "1024x1024"}'"'"'' 