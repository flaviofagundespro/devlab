# Linux Session Notes - Para Próximo Boot Ubuntu

> **IMPORTANTE**: Este arquivo foi criado na sessão Windows (2026-02-06).
> Leia isto quando instalar Claude Code no Ubuntu amanhã.

---

## 🖥️ Context: Dual-Boot Setup

Esta é a **mesma máquina física**:
- **CPU**: AMD Ryzen 9 7900X (12c/24t)
- **GPU**: AMD Radeon RX 6750 XT 12GB
- **OS atual**: Windows → Próxima sessão: Ubuntu (Linux)
- **Projeto**: Mesmo código em ambos os OS

---

## 📊 Performance Esperada no Ubuntu

### Image Generation (GPU com ROCm)
| Resolução | Steps | Tempo Esperado |
|-----------|-------|----------------|
| 512×512   | 20    | **6-7 segundos** ⚡ |
| 768×768   | 30    | **~30 segundos** |

**Comparação Windows vs Linux (mesmo hardware):**
- Windows + CPU/DirectML: ~30s para 512×512
- **Linux + ROCm: 6-7s para 512×512** (5x mais rápido!)

### Modelos que Funcionam
- ✅ `stable-diffusion-1.5`
- ✅ `dreamshaper-8`

---

## 🏗️ Arquitetura no Ubuntu (A Validar)

```
┌─────────────────────────────────────┐
│   AMD RX 6750 XT (GPU via ROCm)     │
│   └─ Image Generation               │  Port 5001
│      (ultra_optimized_server.py)    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Ryzen 9 7900X (CPU)               │
│   └─ LLM Chat Inference             │  Port: ???
│      (modelo local)                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Node.js Backend                   │  Port 3000
│   Frontend React                    │  Port 5173
└─────────────────────────────────────┘
```

**Separação Inteligente:**
- GPU dedicada para imagens (não atrapalha CPU)
- CPU para LLM (não compete com GPU)
- Ambos podem rodar simultaneamente

---

## 🎯 Tarefas para Sessão Ubuntu

### 1. Validar Image Generation
```bash
cd ~/Projetos/APIBR2  # ajustar path conforme necessário

# Iniciar servidor Python
cd integrations
python3 ultra_optimized_server.py

# Verificar logs:
# ✅ Deve mostrar: "AMD GPU detected - running with ROCm"
# ❌ NÃO deve mostrar: "DirectML" ou "Using CPU"
```

**Testar geração:**
```bash
curl -X POST http://localhost:3000/api/v1/image/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-1" \
  -d '{
    "prompt": "beautiful mountain landscape",
    "model": "stable-diffusion-1.5",
    "num_inference_steps": 20,
    "width": 512,
    "height": 512
  }'

# Tempo esperado: 6-7 segundos (não 30s!)
```

### 2. Descobrir e Documentar LLM Chat

**Perguntas a responder:**
- [ ] Qual modelo LLM está rodando? (Llama? Mistral? Outro?)
- [ ] Em qual porta? (5003? 8000? Outra?)
- [ ] Qual arquivo Python roda o LLM?
- [ ] Como acessar via API REST?
- [ ] Como acessar via frontend?
- [ ] Qual tempo de resposta típico?

**Procurar por:**
```bash
# Procurar servidores LLM
find . -name "*llm*.py" -o -name "*chat*.py" -o -name "*ollama*.py"

# Verificar portas em uso
netstat -tuln | grep LISTEN

# Procurar no código
grep -r "llm\|chat\|ollama" --include="*.py" integrations/
```

### 3. Validar Uso Simultâneo
- [ ] Rodar geração de imagem E chat LLM ao mesmo tempo
- [ ] Confirmar que não há conflito de recursos
- [ ] Medir performance de cada um

### 4. Documentar API Remota
- [ ] Endpoints do LLM chat
- [ ] Exemplos de uso via curl
- [ ] Integração com frontend
- [ ] Adicionar ao `CROSS_PLATFORM.md`

---

## 📁 Arquivos Criados Hoje (Windows)

Estes arquivos JÁ estão no projeto e estarão disponíveis no Ubuntu:

1. `.gitattributes` - Normalização de line endings
2. `CROSS_PLATFORM.md` - Guia completo Windows/Linux
3. `COMPATIBILITY_IMPROVEMENTS.md` - Changelog de melhorias
4. `README.md` - Atualizado com info cross-platform
5. `CLAUDE.md` - Atualizado com aviso de compatibilidade
6. **Este arquivo** (`LINUX_SESSION_NOTES.md`)

---

## 🚀 Quick Start no Ubuntu

```bash
# 1. Navegar ao projeto
cd ~/Projetos/APIBR2  # ajustar conforme seu path

# 2. Verificar git
git status
git pull  # se necessário

# 3. Dar permissão aos scripts
chmod +x start_all.sh stop_apibr2.sh

# 4. Iniciar tudo
./start_all.sh

# OU iniciar manualmente:
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Python Image Server
cd integrations && python3 ultra_optimized_server.py

# Terminal 3: Frontend
cd frontend && npm run dev

# Terminal 4: ??? (descobrir servidor LLM)
```

---

## 🔍 O Que Procurar

### Frontend React
- Verificar se há aba/seção de "Chat" ou "LLM"
- URL: http://localhost:5173

### Backend Routes
```bash
# Procurar rotas relacionadas a chat/LLM
grep -r "chat\|llm" backend/src/routes/
grep -r "chat\|llm" backend/src/controllers/
```

### Integrations
```bash
# Listar servidores Python
ls -la integrations/*server*.py
ls -la integrations/*llm*.py
ls -la integrations/*chat*.py
```

---

## 📝 Documentação a Criar

Após descobrir o sistema LLM, documentar:

1. **API Endpoints** (adicionar ao README.md)
   ```markdown
   | Chat LLM | POST /api/chat | Send message to local LLM |
   ```

2. **Exemplos de uso** (adicionar ao README.md)
   ```bash
   curl -X POST http://localhost:XXXX/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, how are you?"}'
   ```

3. **Performance** (adicionar ao CROSS_PLATFORM.md)
   ```markdown
   | LLM Chat (CPU) | Response time: X seconds |
   ```

---

## 🎯 Objetivo da Sessão Ubuntu

1. ✅ Validar ROCm está funcionando (6-7s para imagens)
2. ✅ Descobrir e documentar sistema LLM chat
3. ✅ Confirmar arquitetura GPU+CPU separada
4. ✅ Documentar API remota completa
5. ✅ Atualizar guias de compatibilidade

---

## 💡 Lembrete

- Esta máquina JÁ TEM ROCm instalado (você mencionou que funciona)
- Performance de 6-7s JÁ FOI observada antes
- LLM chat JÁ EXISTE e funciona
- Só precisamos DOCUMENTAR tudo isso!

---

**Criado em**: 2026-02-06 (sessão Windows)
**Para ser lido**: Próxima sessão Ubuntu com Claude Code recém-instalado
**Autor**: Claude Code (Windows session)

Boa noite! 🐧💤
