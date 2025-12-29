# MVP 1 - Recursos e Construções

> **Status:** Não iniciado  
> **Tempo estimado:** 3-4 dias  
> **Pré-requisito:** MVP 0

## Objetivo

Implementar o loop básico: coletar recursos e construir edificações.

## User Stories

- [ ] Como jogador, quero ver meus recursos na tela
- [ ] Como jogador, quero que recursos sejam coletados automaticamente
- [ ] Como jogador, quero construir edificações no mapa
- [ ] Como jogador, quero ver minhas construções no mapa

## Tasks Técnicas

### 1. Sistema de Recursos

- [ ] Criar ResourceManager
- [ ] Criar store de recursos (Zustand)
- [ ] Implementar 4 tipos de recurso
- [ ] Sistema de tick (produção por tempo)

### 2. UI de Recursos

- [ ] Barra de recursos no topo
- [ ] Ícones para cada recurso
- [ ] Valores numéricos
- [ ] Animação de mudança

### 3. Sistema de Construções

- [ ] Criar BuildingManager
- [ ] Criar classe Building
- [ ] Implementar 3 construções:
  - Centro da Vila
  - Casa
  - Fazenda
- [ ] Sistema de custo
- [ ] Validação de recursos

### 4. Colocação no Mapa

- [ ] Modo construção (toggle)
- [ ] Preview da construção
- [ ] Validação de tile (pode construir?)
- [ ] Colocar construção com click
- [ ] Renderizar construção no tile

### 5. Produção

- [ ] Fazenda produz comida
- [ ] Centro da Vila produz um pouco de tudo
- [ ] Exibir produção por segundo

## Recursos

| Recurso | Ícone | Inicial | Cor     |
| ------- | ----- | ------- | ------- |
| Comida  | 🌾    | 100     | #FFD700 |
| Madeira | 🪵    | 50      | #8B4513 |
| Pedra   | 🪨    | 25      | #808080 |
| Ouro    | 💰    | 0       | #FFD700 |

## Construções

### Centro da Vila

- **Custo:** Gratuito (inicial)
- **Produção:** +1 comida, +1 madeira/tick
- **Limite:** 1

### Casa

- **Custo:** 30 madeira
- **Efeito:** +5 população máxima
- **Limite:** Ilimitado

### Fazenda

- **Custo:** 20 madeira, 10 pedra
- **Produção:** +3 comida/tick
- **Tile válido:** Plains apenas
- **Limite:** Ilimitado

## Store (Zustand)

```typescript
interface GameState {
  resources: {
    food: number;
    wood: number;
    stone: number;
    gold: number;
  };
  buildings: Building[];
  addResource: (type: ResourceType, amount: number) => void;
  spendResources: (cost: ResourceCost) => boolean;
  addBuilding: (building: Building) => void;
}
```

## Critérios de Aceite

- [ ] Barra de recursos visível
- [ ] Recursos aumentam com o tempo
- [ ] Posso abrir menu de construção
- [ ] Posso construir Casa gastando madeira
- [ ] Posso construir Fazenda em tile de planície
- [ ] Fazenda aumenta produção de comida
- [ ] Não posso construir sem recursos

## Próximo MVP

Após concluir, seguir para `mvp-2.md` (População e Tempo)
