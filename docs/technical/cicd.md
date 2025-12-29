# CI/CD Pipeline

> **Configuração de integração e deploy contínuo para o projeto.**

---

## 🎯 Estratégia

### Ambientes

| Ambiente    | Branch    | URL                          | Deploy                |
| ----------- | --------- | ---------------------------- | --------------------- |
| Development | `develop` | Local                        | Manual                |
| Preview     | PRs       | `preview-{pr}.stonefall.dev` | Automático            |
| Production  | `main`    | `stonefall.dev`              | Automático após merge |

### Pipeline Overview

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Lint   │ -> │  Test   │ -> │  Build  │ -> │ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
   Biome        Vitest        Turbo         Vercel
```

---

## 📁 Estrutura de Workflows

```
.github/
├── workflows/
│   ├── ci.yml           # Lint, test, build
│   ├── deploy.yml       # Deploy para production
│   └── preview.yml      # Deploy de preview para PRs
├── actions/
│   └── setup/           # Action customizada de setup
│       └── action.yml
└── CODEOWNERS
```

---

## 🔧 Workflows

### CI Principal

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Run Biome
        run: pnpm lint

      - name: Check types
        run: pnpm typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Run tests
        run: pnpm test:run

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Build all packages
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: |
            apps/web/dist
            apps/api/dist

  dead-code:
    name: Dead Code Check
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Run Knip
        run: pnpm knip
```

### Setup Action

```yaml
# .github/actions/setup/action.yml
name: Setup
description: Setup Node.js and pnpm with caching

runs:
  using: composite
  steps:
    - name: Setup pnpm
      uses: pnpm/action-setup@v4
      with:
        version: 10

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "pnpm"

    - name: Install dependencies
      shell: bash
      run: pnpm install --frozen-lockfile

    - name: Cache Turbo
      uses: actions/cache@v4
      with:
        path: .turbo
        key: turbo-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          turbo-${{ runner.os }}-
```

### Deploy Preview

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Build
        run: pnpm build
        env:
          VITE_API_URL: ${{ secrets.PREVIEW_API_URL }}

      - name: Deploy to Vercel
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed!\n\n**URL:** ${{ steps.deploy.outputs.preview-url }}`
            })
```

### Production Deploy

```yaml
# .github/workflows/deploy.yml
name: Production Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy Production
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup

      - name: Build
        run: pnpm build
        env:
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
          VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Deploy Web to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: apps/web

      # API pode ir para Railway, Fly.io, etc
      - name: Deploy API
        run: |
          # Deploy API para serviço escolhido
          echo "Deploy API..."
```

---

## 🔐 Secrets Necessários

| Secret              | Descrição           | Onde obter                |
| ------------------- | ------------------- | ------------------------- |
| `VERCEL_TOKEN`      | Token de API Vercel | vercel.com/account/tokens |
| `VERCEL_ORG_ID`     | ID da organização   | `.vercel/project.json`    |
| `VERCEL_PROJECT_ID` | ID do projeto       | `.vercel/project.json`    |
| `GEMINI_API_KEY`    | API key do Gemini   | aistudio.google.com       |
| `CODECOV_TOKEN`     | Token Codecov       | codecov.io                |

---

## 📋 Scripts do Turbo

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"],
      "cache": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test:run": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### `package.json` (raiz)

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint && biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "test:run": "turbo run test:run",
    "knip": "knip",
    "clean": "turbo run clean && rm -rf node_modules .turbo"
  }
}
```

---

## 📊 Status Badges

```markdown
<!-- No README.md -->

[![CI](https://github.com/user/stonefall/actions/workflows/ci.yml/badge.svg)](https://github.com/user/stonefall/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/user/stonefall/branch/main/graph/badge.svg)](https://codecov.io/gh/user/stonefall)
```

---

## 🚦 Branch Protection

### Configurar no GitHub

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Ativar:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - lint
     - test
     - build
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging

---

## 🔄 Release Flow

### Semver Automático

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: ./.github/actions/setup

      - name: Create Release
        uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          package-name: stonefall
```

### Changelog Automático

O release-please gera changelogs baseados em [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add farm building
fix: resource calculation bug
docs: update README
chore: update dependencies
```

---

## ✅ Checklist de Setup

### MVP 0

- [ ] Criar workflows básicos
- [ ] Configurar Vercel
- [ ] Adicionar secrets no GitHub
- [ ] Configurar branch protection

### MVP 3+

- [ ] Adicionar deploy de API
- [ ] Configurar environments no GitHub
- [ ] Setup release-please
- [ ] Adicionar notificações (Slack/Discord)
