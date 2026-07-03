import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHash } from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed');

  const user = await prisma.user.upsert({
    where: { email: 'teste@financeiro.com' },
    update: {},
    create: {
      name: 'Usuário teste',
      email: 'teste@financeiro.com',
      password: createHash('sha256').update('senha123').digest('hex'),
    },
  });

  console.log(`Usuário criado: ${user.email}`);

  const categorias = [
    { name: 'Alimentação', color: '#f59e0b', icon: '🍔' },
    { name: 'Transporte', color: '#3b82f6', icon: '🚗' },
    { name: 'Saúde', color: '#10b981', icon: '💊' },
    { name: 'Lazer', color: '#8b5cf6', icon: '🎮' },
    { name: 'Salário', color: '#22c55e', icon: '💰' },
  ];

  for (const cat of categorias) {
    await prisma.category.create({
      data: { ...cat, userId: user.id },
    });
  }

  console.log(`${categorias.length} categorias criadas`);
  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
