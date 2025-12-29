# MVP 1 - Recursos e Construções

> **Status:** ✅ Concluído  
> **Data de conclusão:** 29/12/2024
> **Tempo estimado:** 3-4 dias  
> **Pré-requisito:** MVP 0
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md) para valores atualizados.

## Objetivo

Implementar o loop básico: coletar recursos e construir edificações.

## User Stories

- [x] Como jogador, quero ver meus recursos na tela
- [x] Como jogador, quero que recursos sejam coletados automaticamente
- [x] Como jogador, quero construir edificações no mapa
- [x] Como jogador, quero ver minhas construções no mapa

## Tasks Técnicas

### 1. Sistema de Recursos

- [x] Criar ResourceManager
- [x] Criar store de recursos (Zustand)
- [x] Implementar 4 tipos de recurso
- [x] Sistema de tick (produção por tempo)

### 2. UI de Recursos

- [x] Barra de recursos no topo
- [x] Ícones para cada recurso
- [x] Valores numéricos
- [ ] Animação de mudança

### 3. Sistema de Construções

- [x] Criar BuildingManager
- [x] Criar classe Building
- [x] Implementar 4 construções:
  - Centro da Vila
  - Casa
  - Fazenda
  - Serraria (produz madeira em Forest)
- [x] Sistema de custo
- [x] Validação de recursos

### 4. Colocação no Mapa

- [x] Modo construção (toggle)
- [x] Preview da construção
- [x] Validação de tile (pode construir?)
- [x] Colocar construção com click
- [x] Renderizar construção no tile

### 5. Produção

- [x] Fazenda produz comida (tile: Plains)
- [x] Serraria produz madeira (tile: Forest)
- [x] Centro da Vila produz um pouco de tudo
- [x] Exibir produção por segundo

## Recursos

> Valores de referência - ver `balance.md` para valores finais

| Recurso | Ícone | Inicial | Cor     |
| ------- | ----- | ------- | ------- |
| Comida  | 🌾    | 150     | #FFD700 |
| Madeira | 🪵    | 60      | #8B4513 |
| Pedra   | 🪨    | 30      | #808080 |
| Ouro    | 💰    | 0       | #FFD700 |

## Construções

> Valores de referência - ver `balance.md` para valores finais

### Centro da Vila

- **Custo:** Gratuito (inicial)
- **Produção:** +1.5 comida, +1 madeira, +0.5 pedra/tick
- **Limite:** 1

### Casa

- **Custo:** 25 madeira
- **Efeito:** +5 população máxima
- **Limite:** Ilimitado

### Fazenda

- **Custo:** 15 madeira, 5 pedra
- **Produção:** +3 comida/tick
- **Tile válido:** Plains apenas
- **Limite:** Ilimitado

### Serraria (NOVO)

- **Custo:** 20 pedra
- **Produção:** +2 madeira/tick
- **Tile válido:** Forest apenas
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

- [x] Barra de recursos visível
- [x] Recursos aumentam com o tempo
- [x] Posso abrir menu de construção
- [x] Posso construir Casa gastando madeira
- [x] Posso construir Fazenda em tile de planície
- [x] Fazenda aumenta produção de comida
- [x] Não posso construir sem recursos

## Próximo MVP

Após concluir, seguir para `mvp-2.md` (População e Tempo)
