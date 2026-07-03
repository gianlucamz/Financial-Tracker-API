import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../config/prisma';

describe('Categories', () => {
  let token: string;
  let userId: string;
  let categoryId: string;

  const testEmail = `cat-test-${Date.now()}@email.com`;

  beforeAll(async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Teste Categorias',
      email: testEmail,
      password: 'senha123',
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /categories', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Alimentação', color: '#f59e0b', icon: '🍔' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Alimentação');
      categoryId = res.body.id;
    });

    it('deve retornar erro sem token', async () => {
      const res = await request(app).post('/categories').send({ name: 'Sem token' });

      expect(res.status).toBe(401);
    });

    it('deve retornar erro com cor inválida', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Inválida', color: 'vermelho' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /categories', () => {
    it('deve listar as categorias do usuário', async () => {
      const res = await request(app).get('/categories').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /categories/:id', () => {
    it('deve atualizar uma categoria com sucesso', async () => {
      const res = await request(app)
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Alimentação e Bebidas' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Alimentação e Bebidas');
    });
  });

  describe('DELETE /categories/:id', () => {
    it('deve deletar uma categoria com sucesso', async () => {
      const res = await request(app)
        .delete(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });
});
