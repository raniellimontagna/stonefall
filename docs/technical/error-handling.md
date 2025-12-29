# Tratamento de Erros

> **Padrões de error handling, logging e recovery para o projeto.**

---

## 🎯 Princípios

1. **Fail Gracefully:** Nunca crashar completamente
2. **Informative:** Erros devem ajudar no debug
3. **Recoverable:** Sempre ter um caminho de recuperação
4. **Logged:** Todo erro é logado para análise

---

## 📊 Tipos de Erro

### Enum de Erros

```typescript
// packages/shared/src/errors/types.ts
export enum ErrorCode {
  // Game Logic (1xxx)
  INSUFFICIENT_RESOURCES = "E1001",
  INVALID_TILE = "E1002",
  BUILDING_LIMIT_REACHED = "E1003",
  INVALID_ERA = "E1004",
  INVALID_ACTION = "E1005",

  // API/Network (2xxx)
  NETWORK_ERROR = "E2001",
  API_TIMEOUT = "E2002",
  RATE_LIMITED = "E2003",
  INVALID_RESPONSE = "E2004",

  // AI Service (3xxx)
  AI_UNAVAILABLE = "E3001",
  AI_INVALID_RESPONSE = "E3002",
  AI_RATE_LIMITED = "E3003",
  AI_CONTENT_FILTERED = "E3004",

  // Storage (4xxx)
  SAVE_FAILED = "E4001",
  LOAD_FAILED = "E4002",
  CORRUPTED_DATA = "E4003",
  STORAGE_FULL = "E4004",

  // Validation (5xxx)
  VALIDATION_ERROR = "E5001",
  SCHEMA_MISMATCH = "E5002",

  // Unknown (9xxx)
  UNKNOWN = "E9999",
}
```

### Classe Base de Erro

```typescript
// packages/shared/src/errors/GameError.ts
export class GameError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = "GameError";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      context: this.context,
      recoverable: this.recoverable,
      stack: this.stack,
    };
  }
}
```

### Erros Específicos

```typescript
// packages/shared/src/errors/index.ts
export class InsufficientResourcesError extends GameError {
  constructor(required: Resources, available: Resources) {
    super(
      ErrorCode.INSUFFICIENT_RESOURCES,
      `Insufficient resources: required ${JSON.stringify(
        required
      )}, available ${JSON.stringify(available)}`,
      { required, available },
      true
    );
  }
}

export class AIUnavailableError extends GameError {
  constructor(reason?: string) {
    super(
      ErrorCode.AI_UNAVAILABLE,
      `AI service unavailable: ${reason || "unknown reason"}`,
      { reason },
      true // Recoverable via fallback
    );
  }
}
```

---

## 🛡️ Padrões de Recovery

### 1. AI Fallback Chain

```typescript
// apps/api/src/services/aiService.ts
import { generateObject } from "ai";

export async function generateEventWithFallback(
  context: GameContext
): Promise<GameEvent> {
  // Tentar cache primeiro
  const cached = await getCachedEvent(context);
  if (cached) {
    logger.info("Using cached event");
    return cached;
  }

  // Tentar Gemini
  try {
    const event = await generateGeminiEvent(context);
    await cacheEvent(event);
    return event;
  } catch (error) {
    logger.warn("Gemini failed, trying fallback", { error });
  }

  // Fallback: evento pré-definido baseado em contexto
  return selectFallbackEvent(context);
}

function selectFallbackEvent(context: GameContext): GameEvent {
  const pool = FALLBACK_EVENTS[context.era];
  const eligible = pool.filter((e) =>
    e.conditions.every((c) => evaluateCondition(c, context))
  );
  return eligible[Math.floor(Math.random() * eligible.length)];
}
```

### 2. Auto-Save Recovery

```typescript
// apps/web/src/services/saveService.ts
export async function saveGame(state: GameState): Promise<void> {
  const saves = [
    { key: "save_current", data: state },
    { key: `save_backup_${Date.now()}`, data: state },
  ];

  for (const save of saves) {
    try {
      await localStorage.setItem(save.key, JSON.stringify(save.data));
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        // Limpar saves antigos
        await cleanOldSaves();
        await localStorage.setItem(save.key, JSON.stringify(save.data));
      } else {
        throw new GameError(ErrorCode.SAVE_FAILED, "Failed to save game", {
          error,
        });
      }
    }
  }
}

export async function loadGame(): Promise<GameState> {
  try {
    const data = localStorage.getItem("save_current");
    if (!data) throw new Error("No save found");

    const parsed = JSON.parse(data);
    const validated = GameStateSchema.parse(parsed);
    return validated;
  } catch (error) {
    logger.warn("Primary save failed, trying backup");
    return loadLatestBackup();
  }
}
```

### 3. Network Retry com Backoff

```typescript
// packages/shared/src/utils/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) break;

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, {
        error,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
```

---

## 📝 Sistema de Logging

### Logger Estruturado

```typescript
// packages/shared/src/logging/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private handlers: LogHandler[] = [];

  setLevel(level: LogLevel) {
    this.level = level;
  }

  addHandler(handler: LogHandler) {
    this.handlers.push(handler);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, {
      ...context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: (error as GameError).code,
          }
        : undefined,
    });
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ) {
    if (level < this.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    this.handlers.forEach((h) => h.handle(entry));
  }
}

export const logger = new Logger();
```

### Handlers

```typescript
// Console Handler (Development)
export class ConsoleHandler implements LogHandler {
  handle(entry: LogEntry) {
    const method = ["debug", "info", "warn", "error"][entry.level];
    console[method](
      `[${entry.timestamp}] ${entry.message}`,
      entry.context || ""
    );
  }
}

// Memory Handler (para debug in-game)
export class MemoryHandler implements LogHandler {
  private logs: LogEntry[] = [];
  private maxSize = 1000;

  handle(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level === undefined) return [...this.logs];
    return this.logs.filter((l) => l.level >= level);
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
```

---

## 🖥️ UI de Erro

### Error Boundary

```typescript
// apps/web/src/components/ErrorBoundary.tsx
import { Component, ReactNode } from "react";
import { logger } from "@stonefall/shared";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error("React error boundary caught error", error, {
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Toast de Erro

```typescript
// apps/web/src/components/ErrorToast.tsx
import { useErrorStore } from "../stores/errorStore";

export function ErrorToast() {
  const { errors, dismiss } = useErrorStore();

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {errors.map((error) => (
        <div
          key={error.id}
          className={cn(
            "p-4 rounded-lg shadow-lg",
            error.recoverable ? "bg-yellow-100" : "bg-red-100"
          )}
        >
          <p className="font-medium">{error.message}</p>
          {error.action && (
            <button onClick={error.action.handler}>{error.action.label}</button>
          )}
          <button onClick={() => dismiss(error.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Error Store

```typescript
// apps/web/src/stores/errorStore.ts
import { create } from "zustand";
import type { GameError } from "@stonefall/shared";

interface ErrorWithMeta {
  id: string;
  error: GameError;
  message: string;
  recoverable: boolean;
  timestamp: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface ErrorStore {
  errors: ErrorWithMeta[];
  add: (error: GameError, action?: ErrorWithMeta["action"]) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],

  add: (error, action) =>
    set((state) => ({
      errors: [
        ...state.errors,
        {
          id: crypto.randomUUID(),
          error,
          message: getUserFriendlyMessage(error),
          recoverable: error.recoverable,
          timestamp: Date.now(),
          action,
        },
      ],
    })),

  dismiss: (id) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== id),
    })),

  clear: () => set({ errors: [] }),
}));

function getUserFriendlyMessage(error: GameError): string {
  const messages: Record<string, string> = {
    E1001: "Recursos insuficientes para esta ação",
    E1002: "Não é possível construir neste tile",
    E3001: "Serviço de IA temporariamente indisponível",
    E4001: "Erro ao salvar o jogo. Tente novamente.",
  };

  return messages[error.code] || error.message;
}
```

---

## ✅ Checklist de Implementação

### MVP 0

- [ ] Estrutura base de erros
- [ ] Logger com console handler

### MVP 1

- [ ] Error boundary no React
- [ ] Toast de erros

### MVP 2

- [ ] Validação com mensagens claras
- [ ] Memory handler para debug

### MVP 3

- [ ] AI fallback chain
- [ ] Retry com backoff

### MVP 4+

- [ ] Analytics de erros
- [ ] Error reporting service
