# @stonefall/api

Backend API para o jogo Stonefall.

## Stack

- **Hono** - Framework web minimalista e rápido
- **TypeScript** - Type safety
- **Node.js** - Runtime
- **Gemini AI** - Geração de eventos dinâmicos

## Setup

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` e adicione sua chave da API Gemini:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```

   > 💡 **Dica:** Você pode obter uma chave gratuita em [Google AI Studio](https://makersuite.google.com/app/apikey)
   
   > ⚠️ **Nota:** Se não configurar a chave, o sistema funcionará normalmente usando eventos fallback estáticos.

3. **Rodar em desenvolvimento:**
   ```bash
   pnpm dev
   ```

   API estará disponível em: http://localhost:3001

## Endpoints

### Health Check
```
GET /health
```

Verifica se a API está funcionando.

### Gerar Evento
```
POST /api/events/generate
Content-Type: application/json

{
  "era": "stone",
  "tick": 100,
  "population": 10,
  "resources": {
    "food": 50,
    "wood": 30,
    "stone": 20,
    "gold": 0
  },
  "recentEvents": ["Título do último evento"]
}
```

Retorna um evento gerado pela IA ou fallback.

### Status da IA
```
GET /api/events/status
```

Verifica se a API Gemini está disponível.

## Estrutura

```
apps/api/src/
├── index.ts              # Entry point
├── routes/
│   └── events.ts         # Rotas de eventos
└── services/
    ├── gemini.ts         # Cliente Gemini AI
    ├── eventGenerator.ts # Gerador de eventos
    └── index.ts          # Exports
```

## Scripts

- `pnpm dev` - Roda servidor em modo desenvolvimento (watch mode)
- `pnpm build` - Compila TypeScript para JavaScript
- `pnpm start` - Roda servidor em produção
- `pnpm typecheck` - Verifica tipos TypeScript
- `pnpm lint` - Verifica código com ESLint

## Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `GEMINI_API_KEY` | Chave da API Gemini | - | Não* |
| `PORT` | Porta do servidor | 3001 | Não |
| `NODE_ENV` | Ambiente | development | Não |
| `FRONTEND_URL` | URL do frontend (CORS) | http://localhost:5173 | Não |

\* Sem a chave, usa eventos fallback estáticos

## Desenvolvimento

### Adicionar novo endpoint

1. Criar arquivo de rota em `src/routes/`
2. Importar e registrar no `src/index.ts`
3. Atualizar este README com documentação

### Rate Limiting

O cliente Gemini implementa rate limiting automático:
- **10 requests por minuto**
- Retry automático com backoff exponencial
- Fallback para eventos estáticos em caso de falha

## Produção

```bash
pnpm build
pnpm start
```

Recomendações:
- Use um gerenciador de processos (PM2, systemd)
- Configure variáveis de ambiente adequadamente
- Monitore logs e erros
- Configure CORS para seu domínio de produção
