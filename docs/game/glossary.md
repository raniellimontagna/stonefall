# Glossário do Jogo

> **Referência rápida de termos para desenvolvimento e contexto de IA.**
> Todos os termos de código devem usar os nomes em inglês.

## 📍 Tiles (Tipos de Terreno)

| Português | Inglês (código) | Descrição                         |
| --------- | --------------- | --------------------------------- |
| Planície  | `plains`        | Terreno básico, aceita fazendas   |
| Floresta  | `forest`        | Fonte de madeira, aceita serraria |
| Montanha  | `mountain`      | Fonte de pedra, aceita mina       |
| Água      | `water`         | Intransponível, não construível   |
| Ouro      | `gold`          | Raro, aceita mina de ouro         |

---

## 🌾 Recursos

| Português | Inglês (código) | Ícone | Uso Principal         |
| --------- | --------------- | ----- | --------------------- |
| Comida    | `food`          | 🌾    | Sustento, ações       |
| Madeira   | `wood`          | 🪵    | Construções básicas   |
| Pedra     | `stone`         | 🪨    | Construções avançadas |
| Ouro      | `gold`          | 💰    | Evolução, diplomacia  |

---

## 🏗️ Construções

| Português       | Inglês (código) | Era    | Função                 |
| --------------- | --------------- | ------ | ---------------------- |
| Centro da Vila  | `town_center`   | Pedra  | Base, produção inicial |
| Casa            | `house`         | Pedra  | +5 população máxima    |
| Fazenda         | `farm`          | Pedra  | Produz comida          |
| Serraria        | `sawmill`       | Pedra  | Produz madeira         |
| Mina            | `mine`          | Pedra  | Produz pedra           |
| Mina de Ouro    | `gold_mine`     | Bronze | Produz ouro            |
| Quartel         | `barracks`      | Bronze | +força militar         |
| Torre de Defesa | `defense_tower` | Bronze | +defesa                |

---

## 🏛️ Eras

| Português       | Inglês (código) | Ordem |
| --------------- | --------------- | ----- |
| Idade da Pedra  | `stone`         | 1     |
| Idade do Bronze | `bronze`        | 2     |
| Idade do Ferro  | `iron`          | 3     |

---

## ⚔️ Combate

| Português | Inglês (código) | Descrição              |
| --------- | --------------- | ---------------------- |
| Força     | `strength`      | Poder de ataque        |
| Defesa    | `defense`       | Resistência a ataques  |
| Moral     | `morale`        | Multiplicador de poder |
| Atacar    | `attack`        | Ação ofensiva          |
| Defender  | `defend`        | Ação defensiva         |
| Cerco     | `siege`         | Ataque prolongado      |
| Negociar  | `negotiate`     | Ação diplomática       |

---

## 🎲 Eventos

| Português | Inglês (código) | Descrição             |
| --------- | --------------- | --------------------- |
| Econômico | `economic`      | Afeta recursos        |
| Social    | `social`        | Afeta população/moral |
| Militar   | `military`      | Relacionado a combate |
| Político  | `political`     | Diplomacia, traições  |
| Natural   | `natural`       | Desastres, clima      |

---

## 🤖 Rival

| Português     | Inglês (código) | Descrição           |
| ------------- | --------------- | ------------------- |
| Agressivo     | `aggressive`    | Prioriza ataque     |
| Defensivo     | `defensive`     | Prioriza defesa     |
| Diplomático   | `diplomatic`    | Prioriza acordos    |
| Expansionista | `expansionist`  | Prioriza território |

---

## 🎮 Sistema

| Português | Inglês (código) | Descrição                |
| --------- | --------------- | ------------------------ |
| Tick      | `tick`          | Unidade de tempo do jogo |
| Partida   | `match`/`game`  | Uma sessão de jogo       |
| Turno     | `turn`          | (não usado, real-time)   |
| Jogador   | `player`        | Usuário                  |
| Rival     | `rival`         | IA oponente              |
| Crônica   | `chronicle`     | História gerada ao final |

---

## 📊 Estados

| Português | Inglês (código) | Descrição         |
| --------- | --------------- | ----------------- |
| Pausado   | `paused`        | Jogo parado       |
| Jogando   | `playing`       | Jogo em andamento |
| Vitória   | `victory`       | Jogador venceu    |
| Derrota   | `defeat`        | Jogador perdeu    |
| Menu      | `menu`          | Tela de menu      |

---

## 🔧 Desenvolvimento

| Termo     | Descrição                              |
| --------- | -------------------------------------- |
| MVP       | Minimum Viable Product - versão mínima |
| Store     | Estado global (Zustand)                |
| Scene     | Cena do Phaser (tela do jogo)          |
| Manager   | Classe que gerencia um sistema         |
| Service   | Classe para comunicação externa (API)  |
| Hook      | React hook customizado                 |
| Component | Componente React                       |
| Sound Manager | Sistema de áudio (Howler.js)          |
| Debug Menu | Menu de desenvolvimento (F9)           |
| Statistics | Dados de fim de jogo                  |

---

## 📝 Uso nos Prompts de IA

Ao enviar contexto para a IA, use os termos em inglês (código):

```json
{
  "era": "bronze",
  "resources": {
    "food": 150,
    "wood": 80,
    "stone": 45,
    "gold": 12
  },
  "buildings": ["town_center", "farm", "farm", "house", "sawmill"],
  "tiles": {
    "plains": 200,
    "forest": 100,
    "mountain": 60,
    "water": 32,
    "gold": 8
  }
}
```
