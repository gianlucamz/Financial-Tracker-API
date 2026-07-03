import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../config/prisma';

describe('Auth', () => {
  const testEmail = `test-${Date.now()}@email.com`;
  const testPassword = 'senha123';

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('deve resgistrar um novo usuário com sucesso', async () => {
      const res = await request(app).post('/auth/register').send({
        name: 'Usuário Teste',
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testEmail);
    });

    it('deve retornar erro ao registrar e-mail duplicado', async () => {
      const res = await request(app).post('/auth/register').send({
        name: 'Usuário Teste',
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro quando campos obrigatórios estão ausentes', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'semsenha@email.com',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com sucesso', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve retornar erro com senha incorreta', async () => {
      const res = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'senhaerrada',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro com e-mail inexistente', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'naoexiste@email.com',
        password: testPassword,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
