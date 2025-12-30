# Debug Menu

## Visão Geral

Menu de desenvolvimento que permite testar rapidamente todas as funcionalidades do jogo sem precisar jogar uma partida completa.

> ⚠️ **Importante**: Este menu **só aparece em modo de desenvolvimento** (`import.meta.env.DEV === true`) e é automaticamente removido em builds de produção via tree-shaking do Vite.

## Acesso

### Atalho de Teclado
- **F9**: Toggle do menu

### Botão Visual
- Ícone de engrenagem (⚙️) no canto inferior esquerdo
- Cor roxa quando aberto
- Animação de rotação ao abrir

## Funcionalidades

### 🖥️ Telas

Permite testar todas as telas do jogo:

| Ação | Descrição | Ícone |
|------|-----------|-------|
| **Vitória** | Simula vitória instantânea | 🏆 |
| **Derrota (Fome)** | Simula derrota por inanição | 💀 |
| **Derrota (Combate)** | Simula derrota pelo rival | ⚔️ |
| **Evento** | Dispara evento de teste | 📜 |
| **Crônica** | Abre timeline da civilização | 📖 |

### 📦 Recursos

Manipulação rápida de recursos:

| Ação | Descrição | Ícone |
|------|-----------|-------|
| **+500 Recursos** | Adiciona 500 de cada recurso | 💰 |
| **+100 Comida** | Adiciona 100 de comida | 🍖 |
| **+100 Ouro** | Adiciona 100 de ouro | 🪙 |
| **Zerar Comida** | Remove toda comida (testa fome) | 🔥 |

### 🎮 Estado

Controle do estado do jogo:

| Ação | Descrição | Ícone |
|------|-----------|-------|
| **Avançar Era** | Força avanço para próxima era | ⚡ |
| **Derrotar Rival** | Derrota rival instantaneamente | 👑 |
| **Próxima Música** | Pula para outra música aleatória | 🎵 |

### ⚠️ Danger Zone

Ações destrutivas:

| Ação | Descrição | Ícone |
|------|-----------|-------|
| **Reset Jogo** | Reinicia completamente o jogo | 🔄 |

## Implementação

### Estrutura do Componente

```typescript
// apps/web/src/components/ui/DebugMenu.tsx
export function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Atalho F9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // ...
}
```

### Integração no GameCanvas

```typescript
// apps/web/src/components/game/GameCanvas.tsx
{import.meta.env.DEV && <DebugMenu />}
```

### Ações

Cada ação usa diretamente o `gameStore`:

```typescript
const actions: DebugAction[] = [
  {
    label: 'Vitória',
    icon: <Cup size={16} weight="Bold" className="text-gold-main" />,
    action: () => setGameOver('victory'),
    category: 'screens',
  },
  // ...
];
```

## UI/UX

### Design

- **Posição**: Canto inferior esquerdo
- **Animação**: Slide in/out com spring animation
- **Backdrop**: Blur e transparência
- **Cores**: Categorias com cores distintas
  - Telas: Azul
  - Recursos: Verde
  - Estado: Roxo
  - Danger: Vermelho

### Organização

Ações agrupadas por categoria com ícones visuais:

```tsx
<h4 className="text-xs font-bold uppercase">
  {categoryLabels[category].icon}
  {categoryLabels[category].label}
</h4>
```

### Estado Atual

Exibe informações úteis no rodapé:

```
Era: stone
Tick: 42
```

## Segurança

### Remoção em Produção

O menu é completamente removido em builds de produção:

```typescript
// Vite tree-shaking remove este código quando DEV === false
{import.meta.env.DEV && <DebugMenu />}
```

### Verificação

```bash
# Build de produção
pnpm build

# Verificar bundle (não deve conter DebugMenu)
grep -r "DebugMenu" apps/web/dist/
# Resultado: nenhum arquivo encontrado
```

## Casos de Uso

### Desenvolvimento

1. **Testar Telas de Game Over**
   - Clicar em "Vitória" ou "Derrota"
   - Verificar UI, animações, estatísticas

2. **Testar Sistema de Eventos**
   - Clicar em "Evento"
   - Verificar modal, escolhas, efeitos

3. **Testar Progressão de Era**
   - Clicar em "Avançar Era"
   - Verificar desbloqueio de construções

4. **Testar Fome**
   - Clicar em "Zerar Comida"
   - Verificar alerta de fome
   - Verificar morte por inanição

### QA/Testing

1. **Teste de Regressão Rápido**
   - Percorrer todas as telas
   - Verificar se nada quebrou

2. **Teste de Balanceamento**
   - Adicionar recursos
   - Testar diferentes estratégias

3. **Teste de Som**
   - Pular músicas
   - Verificar efeitos sonoros

## Atalhos Úteis

| Tecla | Ação |
|-------|------|
| F9 | Toggle Debug Menu |
| Espaço | Pause/Resume (jogo) |
| 1/2/4 | Velocidade do jogo |

## Limitações

- Não salva estado entre reloads
- Não funciona em produção
- Não tem histórico de ações
- Não tem undo/redo

## Futuras Melhorias

- [ ] Histórico de ações executadas
- [ ] Undo/Redo de ações
- [ ] Salvar/Carregar estados
- [ ] Teleport para tick específico
- [ ] Visualizar variáveis do store
- [ ] Console de comandos
- [ ] Macros/Scripts de teste
