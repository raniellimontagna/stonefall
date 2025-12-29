# Feature Flags e Configuração

> **Sistema de configuração data-driven e feature flags para desenvolvimento seguro.**

---

## 🎯 Por que Feature Flags?

1. **Deploy sem medo** - Código pode ir para produção desativado
2. **Testes A/B** - Comparar diferentes implementações
3. **Rollback instantâneo** - Desativar feature sem redeploy
4. **Desenvolvimento paralelo** - Features incompletas no main

---

## 📊 Estrutura de Configuração

### Hierarquia

```
Defaults (código) → JSON Local → Environment → Runtime Override
```

### Arquivo de Configuração

```typescript
// packages/shared/src/config/types.ts
export interface GameConfig {
  version: string;

  // Feature Flags
  features: {
    aiEvents: boolean; // MVP 3+
    combat: boolean; // MVP 4+
    chronicles: boolean; // MVP 5+
    multiplayer: boolean; // Futuro
    achievements: boolean; // Futuro
    debugging: boolean; // Dev only
  };

  // Balanceamento (importado de balance.json)
  balance: BalanceConfig;

  // Display
  display: {
    tickRate: number; // ms entre ticks (1000 = 1s)
    gridSize: { width: number; height: number };
    tileSize: number; // pixels
    maxFPS: number;
  };

  // API
  api: {
    baseUrl: string;
    timeout: number; // ms
    retries: number;
  };

  // AI
  ai: {
    provider: "gemini" | "openai" | "local";
    model: string;
    maxTokens: number;
    temperature: number;
    cacheEnabled: boolean;
    cacheTTL: number; // segundos
  };

  // Debug
  debug: {
    showGrid: boolean;
    showFPS: boolean;
    showTileCoords: boolean;
    logLevel: "debug" | "info" | "warn" | "error";
    mockAI: boolean;
  };
}
```

### Defaults

```typescript
// packages/shared/src/config/defaults.ts
import type { GameConfig } from "./types";
import balance from "./balance.json";

export const DEFAULT_CONFIG: GameConfig = {
  version: "0.1.0",

  features: {
    aiEvents: false,
    combat: false,
    chronicles: false,
    multiplayer: false,
    achievements: false,
    debugging: import.meta.env.DEV,
  },

  balance,

  display: {
    tickRate: 1000,
    gridSize: { width: 20, height: 20 },
    tileSize: 64,
    maxFPS: 60,
  },

  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
    timeout: 10000,
    retries: 3,
  },

  ai: {
    provider: "gemini",
    model: "gemini-1.5-flash",
    maxTokens: 1024,
    temperature: 0.8,
    cacheEnabled: true,
    cacheTTL: 3600,
  },

  debug: {
    showGrid: false,
    showFPS: false,
    showTileCoords: false,
    logLevel: import.meta.env.DEV ? "debug" : "warn",
    mockAI: false,
  },
};
```

---

## 🔧 Implementação

### Config Manager

```typescript
// packages/shared/src/config/ConfigManager.ts
import { DEFAULT_CONFIG } from "./defaults";
import type { GameConfig } from "./types";
import { deepMerge } from "../utils/deepMerge";

class ConfigManager {
  private config: GameConfig = DEFAULT_CONFIG;
  private listeners: Set<(config: GameConfig) => void> = new Set();

  /**
   * Carrega configuração de múltiplas fontes
   */
  async load(): Promise<void> {
    // 1. Tentar carregar de arquivo local (para override de desenvolvimento)
    try {
      const localConfig = await fetch("/config.local.json").then((r) =>
        r.json()
      );
      this.config = deepMerge(this.config, localConfig);
    } catch {
      // Arquivo não existe, usar defaults
    }

    // 2. Aplicar environment variables
    this.applyEnvOverrides();

    // 3. Notificar listeners
    this.notify();
  }

  private applyEnvOverrides(): void {
    const env = import.meta.env;

    if (env.VITE_FEATURE_AI_EVENTS !== undefined) {
      this.config.features.aiEvents = env.VITE_FEATURE_AI_EVENTS === "true";
    }
    if (env.VITE_FEATURE_COMBAT !== undefined) {
      this.config.features.combat = env.VITE_FEATURE_COMBAT === "true";
    }
    if (env.VITE_AI_PROVIDER) {
      this.config.ai.provider = env.VITE_AI_PROVIDER as "gemini" | "openai";
    }
    if (env.VITE_DEBUG === "true") {
      this.config.features.debugging = true;
      this.config.debug.showGrid = true;
      this.config.debug.showFPS = true;
      this.config.debug.logLevel = "debug";
    }
  }

  /**
   * Obtém a configuração atual
   */
  get(): GameConfig {
    return this.config;
  }

  /**
   * Obtém uma feature flag
   */
  isEnabled(feature: keyof GameConfig["features"]): boolean {
    return this.config.features[feature];
  }

  /**
   * Override em runtime (para debugging)
   */
  override(partial: DeepPartial<GameConfig>): void {
    this.config = deepMerge(this.config, partial);
    this.notify();
  }

  /**
   * Listener para mudanças de config
   */
  onChange(callback: (config: GameConfig) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb(this.config));
  }
}

export const config = new ConfigManager();
```

### React Hook

```typescript
// apps/web/src/hooks/useConfig.ts
import { useState, useEffect } from "react";
import { config, type GameConfig } from "@stonefall/shared";

export function useConfig(): GameConfig {
  const [currentConfig, setCurrentConfig] = useState(config.get());

  useEffect(() => {
    return config.onChange(setCurrentConfig);
  }, []);

  return currentConfig;
}

export function useFeature(feature: keyof GameConfig["features"]): boolean {
  const cfg = useConfig();
  return cfg.features[feature];
}
```

### Uso em Componentes

```typescript
// apps/web/src/components/GameUI.tsx
import { useFeature } from "../hooks/useConfig";

export function GameUI() {
  const aiEventsEnabled = useFeature("aiEvents");
  const combatEnabled = useFeature("combat");
  const debuggingEnabled = useFeature("debugging");

  return (
    <div>
      <ResourceBar />

      {aiEventsEnabled && <EventPanel />}
      {combatEnabled && <MilitaryPanel />}

      {debuggingEnabled && <DebugOverlay />}
    </div>
  );
}
```

---

## 📁 Arquivo de Balanceamento

### `config/balance.json`

```json
{
  "resources": {
    "initial": {
      "food": 150,
      "wood": 50,
      "stone": 20,
      "gold": 0,
      "faith": 0
    },
    "cap": {
      "stone_age": {
        "food": 500,
        "wood": 300,
        "stone": 200,
        "gold": 0,
        "faith": 100
      }
    }
  },
  "buildings": {
    "town_center": {
      "cost": {},
      "production": { "food": 1.5 },
      "housing": 5,
      "unique": true
    },
    "house": {
      "cost": { "wood": 25 },
      "housing": 4
    },
    "farm": {
      "cost": { "wood": 15, "stone": 5 },
      "production": { "food": 2 },
      "validTiles": ["plain"]
    },
    "sawmill": {
      "cost": { "wood": 20, "stone": 10 },
      "production": { "wood": 2 },
      "validTiles": ["forest"],
      "tileBonus": { "forest": 1.5 }
    },
    "quarry": {
      "cost": { "wood": 30 },
      "production": { "stone": 2 },
      "validTiles": ["mountain"]
    }
  },
  "population": {
    "consumptionPerTick": 0.3,
    "growthThreshold": 20
  },
  "eras": {
    "stone_age": {
      "ticksRequired": 100,
      "requirements": {}
    },
    "bronze_age": {
      "ticksRequired": 300,
      "requirements": {
        "population": 20,
        "buildings": { "quarry": 2 }
      }
    }
  }
}
```

---

## 🌍 Environment Variables

### `.env.example`

```bash
# API
VITE_API_URL=http://localhost:3000

# AI
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your-key-here

# Feature Flags (opcional - override dos defaults)
VITE_FEATURE_AI_EVENTS=false
VITE_FEATURE_COMBAT=false
VITE_FEATURE_CHRONICLES=false

# Debug
VITE_DEBUG=false
```

### `.env.development`

```bash
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
VITE_FEATURE_AI_EVENTS=true
```

### `.env.production`

```bash
VITE_API_URL=https://api.stonefall.dev
VITE_DEBUG=false
```

---

## 🐛 Debug Panel

```typescript
// apps/web/src/components/DebugPanel.tsx
import { useState } from "react";
import { config } from "@stonefall/shared";
import { useConfig, useFeature } from "../hooks/useConfig";

export function DebugPanel() {
  const currentConfig = useConfig();
  const [isOpen, setIsOpen] = useState(false);

  if (!useFeature("debugging")) return null;

  return (
    <div className="fixed top-0 right-0 bg-black/80 text-white text-xs p-2">
      <button onClick={() => setIsOpen(!isOpen)}>
        🐛 Debug {isOpen ? "▼" : "▲"}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          <div>
            <strong>Features:</strong>
            {Object.entries(currentConfig.features).map(([key, value]) => (
              <label key={key} className="block">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    config.override({
                      features: { [key]: e.target.checked },
                    })
                  }
                />
                {key}
              </label>
            ))}
          </div>

          <div>
            <strong>Display:</strong>
            <label className="block">
              <input
                type="checkbox"
                checked={currentConfig.debug.showGrid}
                onChange={(e) =>
                  config.override({ debug: { showGrid: e.target.checked } })
                }
              />
              Show Grid
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={currentConfig.debug.showFPS}
                onChange={(e) =>
                  config.override({ debug: { showFPS: e.target.checked } })
                }
              />
              Show FPS
            </label>
          </div>

          <div>
            <strong>AI:</strong>
            <label className="block">
              <input
                type="checkbox"
                checked={currentConfig.debug.mockAI}
                onChange={(e) =>
                  config.override({ debug: { mockAI: e.target.checked } })
                }
              />
              Mock AI (use fallbacks)
            </label>
          </div>

          <button
            onClick={() => console.log("Config:", currentConfig)}
            className="bg-blue-500 px-2 py-1 rounded"
          >
            Log Config
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 Ativação por MVP

| Feature Flag   | MVP | Default       |
| -------------- | --- | ------------- |
| `debugging`    | 0   | `true` em dev |
| `aiEvents`     | 3   | `false`       |
| `combat`       | 4   | `false`       |
| `chronicles`   | 5   | `false`       |
| `achievements` | 7+  | `false`       |
| `multiplayer`  | 10+ | `false`       |

---

## ✅ Checklist

### MVP 0

- [ ] Criar estrutura de config
- [ ] Implementar ConfigManager
- [ ] Criar balance.json
- [ ] Setup environment variables

### MVP 1+

- [ ] Hook useConfig
- [ ] Debug panel básico

### MVP 3+

- [ ] Feature flags funcionais
- [ ] Override em runtime
