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
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.1",
  "engines": {
    "node": ">=20"
  }
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
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
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
| Vite       | ^6.0.6  | Build tool       |
| React      | ^19.0.0 | UI Framework     |
| Phaser     | ^3.87.0 | Game engine      |
| TypeScript | ^5.7.2  | Linguagem        |
| Zustand    | ^5.0.2  | State management |

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
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "phaser": "^3.87.0",
    "zustand": "^5.0.2",
    "@stonefall/shared": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.6"
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
| Hono                  | ^4.6.14 | Web framework |
| Node.js               | >=20    | Runtime       |
| TypeScript            | ^5.7.2  | Linguagem     |
| Zod                   | ^3.24.1 | Validação     |
| @google/generative-ai | ^0.21.0 | Gemini API    |

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
    "hono": "^4.6.14",
    "@hono/node-server": "^1.13.7",
    "@hono/zod-validator": "^0.4.2",
    "@google/generative-ai": "^0.21.0",
    "zod": "^3.24.1",
    "@stonefall/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "tsx": "^4.19.2",
    "@types/node": "^22.10.2"
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

| Tecnologia | Versão  | Uso                  |
| ---------- | ------- | -------------------- |
| TypeScript | ^5.7.2  | Linguagem            |
| Zod        | ^3.24.1 | Schemas de validação |

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
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
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

| Pacote                | Versão   | Local           |
| --------------------- | -------- | --------------- |
| Node.js               | >=20 LTS | Runtime         |
| pnpm                  | 9.15.1   | Package manager |
| Turborepo             | ^2.3.3   | Root            |
| TypeScript            | ^5.7.2   | Todos           |
| Biome                 | 1.9.4    | Root            |
| Vite                  | ^6.0.6   | web             |
| Phaser                | ^3.87.0  | web             |
| Zustand               | ^5.0.2   | web             |
| Hono                  | ^4.6.14  | api             |
| Zod                   | ^3.24.1  | api, shared     |
| @google/generative-ai | ^0.21.0  | api             |
| Vitest                | ^2.1.8   | Testes          |

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

# Adicionar dependência em um app específico
pnpm add <pkg> --filter @stonefall/web
pnpm add <pkg> --filter @stonefall/api

# Adicionar dependência no root (devDependency)
pnpm add -Dw <pkg>

# Limpar todos os builds e node_modules
pnpm clean
```
