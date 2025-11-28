#!/bin/bash

# cURL para JavaScript Scraping - APIBR2
# Para importar no n8n HTTP Request node

curl -X POST "http://localhost:3000/api/scrape" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "strategy": "javascript",
    "url": "https://httpbin.org/html",
    "script": "document.querySelector(\"h1\").textContent.trim()"
  }'

# Exemplos de outros scripts JavaScript que você pode usar:

# 1. Extrair todos os links da página:
# "script": "Array.from(document.querySelectorAll('a')).map(a => ({text: a.textContent.trim(), href: a.href}))"

# 2. Extrair título e meta description:
# "script": "({title: document.title, description: document.querySelector('meta[name=\"description\"]')?.content || ''})"

# 3. Extrair dados de uma tabela:
# "script": "Array.from(document.querySelectorAll('table tr')).map(row => Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim()))"

# 4. Extrair dados de uma lista:
# "script": "Array.from(document.querySelectorAll('ul li')).map(li => li.textContent.trim())"

# 5. Extrair dados de cards/produtos:
# "script": "Array.from(document.querySelectorAll('.product-card')).map(card => ({title: card.querySelector('.title')?.textContent.trim(), price: card.querySelector('.price')?.textContent.trim()}))"

# 6. Extrair dados com wait (para páginas que carregam dinamicamente):
# "script": "document.querySelector('.dynamic-content').textContent.trim()",
# "waitFor": {"selector": ".dynamic-content", "timeout": 5000} 