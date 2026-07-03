# 💰 Financial Tracker API

API REST para controle de finanças pessoais, desenvolvida com TypeScript, Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- **TypeScript** — Tipagem estática
- **Node.js + Express** — Servidor HTTP
- **PostgreSQL + Prisma ORM** — Banco de dados
- **JWT + Bcrypt** — Autenticação segura
- **Zod** — Validação de dados
- **Vitest + Supertest** — Testes automatizados
- **Swagger** — Documentação interativa

## ✨ Funcionalidades

- Autenticação com JWT (registro e login)
- CRUD de categorias personalizadas
- CRUD de transações (receitas e despesas)
- Filtros por tipo, categoria e período
- Paginação de resultados
- Relatório de resumo financeiro
- Relatório de gastos por categoria
- Evolução financeira mensal
- Exportação de dados em CSV
- Documentação interativa com Swagger

## 📦 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/financial-tracker-api.git
cd financial-tracker-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Suba o banco de dados
docker-compose up -d

# Execute as migrations
npx prisma migrate dev

# Popule o banco com dados iniciais
npx prisma db seed

# Inicie o servidor
npm run dev
```

## 📖 Documentação

Acesse `http://localhost:3000/docs` para a documentação interativa Swagger.

## 🧪 Testes

```bash
npm test
```

## 📡 Endpoints

| Método | Rota                       | Descrição            | Auth |
| ------ | -------------------------- | -------------------- | ---- |
| POST   | /auth/register             | Registrar usuário    | ❌   |
| POST   | /auth/login                | Login                | ❌   |
| GET    | /categories                | Listar categorias    | ✅   |
| POST   | /categories                | Criar categoria      | ✅   |
| PUT    | /categories/:id            | Atualizar categoria  | ✅   |
| DELETE | /categories/:id            | Deletar categoria    | ✅   |
| GET    | /transactions              | Listar transações    | ✅   |
| POST   | /transactions              | Criar transação      | ✅   |
| PUT    | /transactions/:id          | Atualizar transação  | ✅   |
| DELETE | /transactions/:id          | Deletar transação    | ✅   |
| GET    | /reports/summary           | Resumo financeiro    | ✅   |
| GET    | /reports/by-category       | Gastos por categoria | ✅   |
| GET    | /reports/monthly-evolution | Evolução mensal      | ✅   |
| GET    | /reports/export/csv        | Exportar CSV         | ✅   |

## 🌿 Git Flow

Este projeto segue o padrão Git Flow com commits em português:

- `feat/` — Novas funcionalidades
- `fix/` — Correções de bugs
- `chore/` — Configurações e manutenção
