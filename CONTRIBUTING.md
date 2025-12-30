# 🤝 Contribuindo para o Project Stonefall

Obrigado pelo seu interesse em contribuir com o **Project Stonefall**! Toda ajuda é bem-vinda, seja corrigindo bugs, adicionando funcionalidades, melhorando o balanceamento ou sugerindo novas artes.

## 🚀 Como começar

1. **Faça um Fork** do repositório.
2. **Clone seu fork** localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/stonefall.git
   cd stonefall
   ```
3. **Instale as dependências** (usamos o `pnpm`):
   ```bash
   pnpm install
   ```
4. **Crie uma branch** para sua alteração:
   ```bash
   git checkout -b feature/minha-melhoria
   ```

## 🛠️ Ambiente de Desenvolvimento

- **Requisitos:** Node.js >= 20 e pnpm.
- **Iniciando:** `pnpm dev` roda o frontend (Phaser/React) e o backend (Hono).
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001

## 📏 Padrões de Código

- Usamos o **Biome** para lint e formatação.
- Antes de enviar seu PR, rode `pnpm check:fix`.
- Siga as tipagens do TypeScript.

## 🎨 Arte e Estilo

Se você quer contribuir com novas artes, consulte nosso [Guia de Estilo Visual](./docs/art/style-guide.md). Usamos pixel art 64x64 em perspectiva 3/4 isométrica.

## 📥 Como enviar suas alterações

1. Faça o commit das suas alterações: `git commit -m "feat: adiciona nova construção"`.
2. Envie para o seu fork: `git push origin feature/minha-melhoria`.
3. Abra um **Pull Request** no repositório original descrevendo suas mudanças.

## 💬 Comunidade e Dúvidas

Se tiver dúvidas, abra uma **Issue** ou entre em contato com os mantenedores.

---

Ao contribuir, você aceita que seu código será distribuído sob a licença MIT do projeto.
