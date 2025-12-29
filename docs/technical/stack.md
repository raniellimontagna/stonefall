# Stack Tecnológica

## 📌 Política de Versões

> **REGRA:** Sempre utilizar as versões mais recentes estáveis de todas as dependências.

### Diretrizes

1. **Antes de iniciar:** Verificar versões atuais no npm/pnpm
2. **Atualizações:** Manter dependências atualizadas regularmente
3. **Breaking changes:** Avaliar changelog antes de major updates
4. **Lock file:** Commitar `pnpm-lock.yaml` para reprodutibilidade

### Comandos Úteis

```bash
# Verificar versões desatualizadas
pnpm outdated

# Atualizar todas as dependências
pnpm update

# Atualizar uma dependência específica
pnpm update <package>@latest

# Verificar versão mais recente
pnpm view <package> version

# Atualizar em todos os workspaces
pnpm update -r
```

---

## 🏗️ Infraestrutura do Monorepo

### pnpm

**Gerenciador de Pacotes**

Por que pnpm:

- ⚡ Mais rápido que npm/yarn
- 💾 Economiza espaço em disco (hard links)
- 🔒 Estrutura de node_modules mais segura
- 📦 Suporte nativo a workspaces

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar versão
pnpm --version
```

### Turborepo

**Build System para Monorepos**

Por que Turborepo:

- 🚀 Cache inteligente (local e remoto)
- ⚡ Execução paralela de tasks
- 📊 Gráfico de dependências automático
- 🔄 Watch mode integrado

```bash
# Instalado como devDependency no root
pnpm add -Dw turbo
```

### Knip

**Detector de Código e Dependências Não Utilizadas**

Por que Knip:

- 🔍 Encontra exports não utilizados
- 📦 Detecta dependências não usadas
- 🗑️ Identifica arquivos órfãos
- 🧹 Mantém o codebase limpo
- 📊 Suporte a monorepos/workspaces

```bash
# Instalado como devDependency no root
pnpm add -Dw knip

# Rodar análise
pnpm knip

# Modo watch (development)
pnpm knip --watch
```

**Benefícios:**

1. **Reduz bundle size** - Remove código morto
2. **Melhora manutenção** - Menos código = menos bugs
3. **Acelera builds** - Menos arquivos para processar
4. **CI/CD** - Pode falhar build se houver código não usado

---

## 📁 Configuração do Workspace

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

### package.json (Root)

```json
{
  "name": "stonefall",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "check": "biome check --write .",
    "format": "biome format --write .",
    "test": "turbo test",
    "knip": "knip",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.3.10",
    "knip": "^5.78.0",
    "turbo": "^2.7.2",
    "typescript": "^5.9.3"
  },
  "packageManager": "pnpm@10.26.2",
  "engines": {
    "node": ">=20"
  }
}
```

### knip.json

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "workspaces": {
    "apps/web": {
      "entry": ["src/main.tsx"],
      "project": ["src/**/*.{ts,tsx}"],
      "ignore": ["src/vite-env.d.ts"]
    },
    "apps/api": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    },
    "packages/shared": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    }
  },
  "ignoreDependencies": ["@types/*"]
}
```

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  }
}
```

### biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.10/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "files": {
    "ignore": ["**/dist/**", "**/node_modules/**", "**/.turbo/**"]
  }
}
```

---

## 🎮 apps/web - Frontend

### Stack

| Tecnologia | Versão  | Uso              |
| ---------- | ------- | ---------------- |
| Vite       | ^7.3.0  | Build tool       |
| React      | ^19.2.3 | UI Framework     |
| Phaser     | ^3.90.0 | Game engine      |
| TypeScript | ^5.9.3  | Linguagem        |
| Zustand    | ^5.0.9  | State management |

### Arquitetura Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                      apps/web                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    React App                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   UI/HUD    │  │   Modais    │  │   Menus     │  │   │
│  │  │ Components  │  │  (Eventos)  │  │ (Build etc) │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │   │
│  │         └────────────────┼────────────────┘         │   │
│  │                          │                          │   │
│  │                   ┌──────▼──────┐                   │   │
│  │                   │   Zustand   │                   │   │
│  │                   │   (State)   │                   │   │
│  │                   └──────┬──────┘                   │   │
│  └──────────────────────────┼──────────────────────────┘   │
│                             │                               │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │                   Phaser Game                        │   │
│  │  (Canvas - renderizado dentro de um componente)     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Integração React + Phaser

O Phaser roda dentro de um componente React. A comunicação é feita via Zustand:

```typescript
// React Component atualiza estado
useGameStore.getState().addResource("food", 10);

// Phaser lê o estado
const food = useGameStore.getState().resources.food;

// Phaser pode disparar eventos que React escuta
useGameStore.getState().triggerEvent(eventData);
```

### package.json

```json
{
  "name": "@stonefall/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "biome lint src",
    "check": "biome check --write src"
  },
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "phaser": "^3.90.0",
    "zustand": "^5.0.9",
    "@stonefall/shared": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.2",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^25.0.3",
    "typescript": "^5.9.3",
    "vite": "^7.3.0"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### Estrutura de Componentes React

```
apps/web/src/
├── main.tsx                    # Entry point React
├── App.tsx                     # Componente principal
├── components/
│   ├── game/
│   │   └── GameCanvas.tsx      # Wrapper do Phaser
│   ├── ui/
│   │   ├── ResourceBar.tsx     # Barra de recursos
│   │   ├── BuildMenu.tsx       # Menu de construção
│   │   ├── TimeControls.tsx    # Controles de velocidade
│   │   └── EraProgress.tsx     # Progresso de era
│   ├── modals/
│   │   ├── EventModal.tsx      # Modal de eventos
│   │   └── EndGameModal.tsx    # Modal de fim de jogo
│   └── common/
│       ├── Button.tsx
│       ├── Panel.tsx
│       └── Icon.tsx
├── hooks/
│   ├── useGame.ts              # Hook para interagir com Phaser
│   └── useApi.ts               # Hook para chamadas à API
├── store/
│   ├── gameStore.ts
│   └── uiStore.ts
├── game/                       # Código Phaser
│   ├── Game.ts
│   ├── scenes/
│   └── ...
└── styles/
    └── index.css
```

---

## 🔧 apps/api - Backend

### Stack

| Tecnologia            | Versão  | Uso           |
| --------------------- | ------- | ------------- |
| Hono                  | ^4.11.3 | Web framework |
| Node.js               | >=20    | Runtime       |
| TypeScript            | ^5.9.3  | Linguagem     |
| Zod                   | ^4.2.1  | Validação     |
| @google/generative-ai | ^0.24.1 | Gemini API    |

### Por que Hono?

- ⚡ Ultra rápido
- 🪶 Leve (~14kb)
- 🌍 Roda em qualquer lugar (Node, Bun, Deno, Edge)
- 🔧 TypeScript first
- 🛠️ Middleware rico

### package.json

```json
{
  "name": "@stonefall/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "biome lint src",
    "check": "biome check --write src"
  },
  "dependencies": {
    "hono": "^4.11.3",
    "@hono/node-server": "^1.19.7",
    "@hono/zod-validator": "^0.7.6",
    "@google/generative-ai": "^0.24.1",
    "zod": "^4.2.1",
    "@stonefall/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "tsx": "^4.21.0",
    "@types/node": "^25.0.3"
  }
}
```

### Estrutura da API

```typescript
// apps/api/src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import events from "./routes/events";
import narrative from "./routes/narrative";
import health from "./routes/health";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Routes
app.route("/events", events);
app.route("/narrative", narrative);
app.route("/health", health);

// Start server
const port = Number(process.env.PORT) || 3001;
console.log(`🚀 API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
```

---

## 📦 packages/shared

### Stack

| Tecnologia | Versão | Uso                  |
| ---------- | ------ | -------------------- |
| TypeScript | ^5.9.3 | Linguagem            |
| Zod        | ^4.2.1 | Schemas de validação |

### package.json

```json
{
  "name": "@stonefall/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "biome lint src",
    "check": "biome check --write src"
  },
  "dependencies": {
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

### Exemplo de Exports

```typescript
// packages/shared/src/index.ts
export * from "./types";
export * from "./constants";
export * from "./validation";
```

---

## 🧪 Testes

### Vitest

```bash
pnpm add -Dw vitest @vitest/coverage-v8
```

Configuração no root `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
    },
  },
});
```

> **Nota:** Vitest 4.x requer configuração atualizada. Verificar changelog para breaking changes.

---

## 🚀 Deploy

### Frontend (apps/web)

**Vercel**

- Deploy automático via Git
- Preview branches
- Edge CDN

**Cloudflare Pages**

- Alternativa
- CDN global
- Workers para SSR (se necessário)

### Backend (apps/api)

**Railway / Render**

- Deploy automático
- Scaling automático
- Environment variables

**Fly.io**

- Deploy global
- Auto-scaling
- Máquinas sob demanda

**Cloudflare Workers**

- Edge computing
- Hono suporta nativamente

---

## 📊 Resumo de Versões

> ⚠️ Verificar versões mais recentes antes de iniciar!
> 📅 Última verificação: 29/12/2025

| Pacote                | Versão   | Local           |
| --------------------- | -------- | --------------- |
| Node.js               | >=20 LTS | Runtime         |
| pnpm                  | 10.26.2  | Package manager |
| Turborepo             | ^2.7.2   | Root            |
| TypeScript            | ^5.9.3   | Todos           |
| Biome                 | ^2.3.10  | Root            |
| Knip                  | ^5.78.0  | Root            |
| Vite                  | ^7.3.0   | web             |
| React                 | ^19.2.3  | web             |
| Phaser                | ^3.90.0  | web             |
| Zustand               | ^5.0.9   | web             |
| Hono                  | ^4.11.3  | api             |
| Zod                   | ^4.2.1   | api, shared     |
| @google/generative-ai | ^0.24.1  | api             |
| Vitest                | ^4.0.16  | Testes          |

---

## ⚠️ Breaking Changes e Riscos

### 🔴 Zod 4.x (MAJOR)

**O que mudou:**

- Nova API de schemas
- Mudanças em `.parse()`, `.safeParse()`
- Novos métodos de validação

**Mitigação:**

```typescript
// Verificar sintaxe no momento da implementação
// Consultar: https://zod.dev/v4
```

### 🔴 Vite 7.x (MAJOR)

**O que mudou:**

- Possíveis mudanças na config
- Plugins podem precisar atualização

**Mitigação:**

- Verificar changelog do Vite 7
- `@vitejs/plugin-react` 5.x já é compatível

### 🔴 Biome 2.x (MAJOR)

**O que mudou:**

- Schema do `biome.json` atualizado
- Possíveis novas regras padrão

**Mitigação:**

- Usar schema 2.3.10 no biome.json
- Verificar: https://biomejs.dev/blog/

### 🔴 Vitest 4.x (MAJOR)

**O que mudou:**

- API de configuração pode ter mudado
- Coverage config diferente

**Mitigação:**

- Consultar docs atualizados na implementação

---

## 🛡️ Potenciais Problemas e Soluções

### 1. Integração React + Phaser

**Problema:** Phaser manipula o DOM diretamente, React usa Virtual DOM.

**Solução:**

```typescript
// GameCanvas.tsx - usar useRef e cleanup
useEffect(() => {
  if (!containerRef.current || gameRef.current) return;

  gameRef.current = new Phaser.Game({
    ...config,
    parent: containerRef.current,
  });

  return () => {
    gameRef.current?.destroy(true);
    gameRef.current = null;
  };
}, []);
```

### 2. Estado Compartilhado (Zustand)

**Problema:** Sincronizar estado entre React e Phaser game loop.

**Solução:**

```typescript
// Phaser lê estado diretamente (não via hook)
const resources = useGameStore.getState().resources;

// Subscrição para atualizações no Phaser
useGameStore.subscribe((state) => {
  // Atualizar sprites/UI do Phaser
});
```

### 3. Zod v4 + @hono/zod-validator

**Status:** ✅ Compatível! `@hono/zod-validator` suporta `zod ^3.25.0 || ^4.0.0`

**Nota:** Verificar sintaxe de schemas Zod 4 na implementação.

### 4. Hot Module Replacement (HMR)

**Problema:** HMR pode causar múltiplas instâncias do Phaser.

**Solução:**

```typescript
// vite.config.ts - desabilitar HMR para game
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      // Ou configurar overlay: false para game
    },
  },
});
```

### 5. TypeScript Strict Mode

**Problema:** Phaser types podem não ser 100% compatíveis com strict.

**Solução:**

```json
// tsconfig.json do apps/web
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true // Ignora erros em .d.ts
  }
}
```

### 6. Bundle Size

**Problema:** Phaser é grande (~1MB minified).

**Mitigação:**

```typescript
// Importar apenas o necessário (se possível)
import Phaser from "phaser";
// Considerar code splitting para scenes
```

### 7. CORS na API

**Problema:** Frontend em :3000, API em :3001.

**Solução:** Já configurado no vite.config.ts com proxy:

```typescript
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
}
```

### 8. Rate Limiting Gemini API

**Problema:** Gemini tem limites de requisições.

**Mitigação:**

- Implementar cache na API
- Debounce em chamadas frequentes
- Fallback para eventos pré-definidos

---

## 🛠️ Comandos do Workspace

```bash
# Instalar todas as dependências
pnpm install

# Rodar todos os devs em paralelo
pnpm dev

# Build de todos os pacotes
pnpm build

# Lint em todo o monorepo
pnpm check

# Rodar testes
pnpm test

# Detectar código/deps não utilizados
pnpm knip

# Adicionar dependência em um app específico
pnpm add <pkg> --filter @stonefall/web
pnpm add <pkg> --filter @stonefall/api

# Adicionar dependência no root (devDependency)
pnpm add -Dw <pkg>

# Limpar todos os builds e node_modules
pnpm clean
```
