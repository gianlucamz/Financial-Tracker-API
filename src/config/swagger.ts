import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Financial Tracker API',
    version: '1.0.0',
    description: 'API REST para controle de finanças pessoais com autenticação JWT.',
    contact: { name: 'GitHub', url: 'https://github.com/seu-usuario/financial-tracker-api' },
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          color: { type: 'string', example: '#6366f1' },
          icon: { type: 'string', example: '🍔' },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          amount: { type: 'number' },
          type: { type: 'string', enum: ['RECEITA', 'DESPESA'] },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' },
          category: { $ref: '#/components/schemas/Category' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está funcionando',
        responses: { '200': { description: 'API funcionando' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@email.com' },
                  password: { type: 'string', example: 'senha123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuário criado com sucesso' },
          '400': { description: 'Dados inválidos ou e-mail já cadastrado' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realiza login e retorna token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'joao@email.com' },
                  password: { type: 'string', example: 'senha123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login realizado com sucesso' },
          '400': { description: 'Credenciais inválidas' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lista todas as categorias do usuário',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de categorias' },
          '401': { description: 'Não autorizado' },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Cria uma nova categoria',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Alimentação' },
                  color: { type: 'string', example: '#f59e0b' },
                  icon: { type: 'string', example: '🍔' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Categoria criada com sucesso' },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autorizado' },
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Busca uma categoria por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Categoria encontrada' },
          '404': { description: 'Categoria não encontrada' },
        },
      },
      put: {
        tags: ['Categories'],
        summary: 'Atualiza uma categoria',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  color: { type: 'string' },
                  icon: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Categoria atualizada' },
          '404': { description: 'Categoria não encontrada' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Remove uma categoria',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '204': { description: 'Categoria removida com sucesso' },
          '404': { description: 'Categoria não encontrada' },
        },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Lista transações com filtros e paginação',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['RECEITA', 'DESPESA'] } },
          { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': { description: 'Lista de transações com paginação' },
          '401': { description: 'Não autorizado' },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Cria uma nova transação',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'amount', 'type', 'date', 'categoryId'],
                properties: {
                  title: { type: 'string', example: 'Salário' },
                  amount: { type: 'number', example: 3500.0 },
                  type: { type: 'string', enum: ['RECEITA', 'DESPESA'] },
                  date: { type: 'string', format: 'date', example: '2024-01-05' },
                  description: { type: 'string', example: 'Salário mensal' },
                  categoryId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Transação criada com sucesso' },
          '400': { description: 'Dados inválidos' },
          '401': { description: 'Não autorizado' },
        },
      },
    },
    '/reports/summary': {
      get: {
        tags: ['Reports'],
        summary: 'Resumo financeiro do período',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: { '200': { description: 'Resumo com receitas, despesas e saldo' } },
      },
    },
    '/reports/by-category': {
      get: {
        tags: ['Reports'],
        summary: 'Gastos agrupados por categoria',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: { '200': { description: 'Lista de categorias com totais' } },
      },
    },
    '/reports/monthly-evolution': {
      get: {
        tags: ['Reports'],
        summary: 'Evolução financeira mensal do ano',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'year', in: 'query', schema: { type: 'integer', example: 2024 } }],
        responses: { '200': { description: 'Evolução mês a mês do ano' } },
      },
    },
    '/reports/export/csv': {
      get: {
        tags: ['Reports'],
        summary: 'Exporta transações do período em CSV',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: { '200': { description: 'Arquivo CSV para download' } },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger disponível em http://localhost:3000/docs');
}
