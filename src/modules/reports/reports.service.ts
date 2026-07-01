import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { PeriodFilterDTO, YearFilterDTO } from './reports.dto';

export class ReportsService {
  async getSummary(userId: string, { startDate, endDate }: PeriodFilterDTO) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      select: { type: true, amount: true },
    });

    const totalReceitas = transactions
      .filter((t) => t.type === 'RECEITA')
      .reduce((acc, t) => acc.add(t.amount), new Prisma.Decimal(0));

    const totalDespesas = transactions
      .filter((t) => t.type === 'DESPESA')
      .reduce((acc, t) => acc.add(t.amount), new Prisma.Decimal(0));

    const saldo = totalReceitas.sub(totalDespesas);

    return {
      periodo: { startDate, endDate },
      totalReceitas: Number(totalReceitas),
      totalDespesas: Number(totalDespesas),
      saldo: Number(saldo),
      totalTransacoes: transactions.length,
    };
  }

  async getByCategory(userId: string, { startDate, endDate }: PeriodFilterDTO) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { category: true },
      orderBy: { date: 'desc' },
    });

    const grouped = new Map<
      string,
      {
        categoryId: string;
        name: string;
        color: string;
        icon: string | null;
        total: Prisma.Decimal;
        quantidade: number;
      }
    >();

    for (const t of transactions) {
      const key = `${t.categoryId}-${t.type}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.total = existing.total.add(t.amount);
        existing.quantidade += 1;
      } else {
        grouped.set(key, {
          categoryId: t.categoryId,
          name: t.category.name,
          color: t.category.color,
          icon: t.category.icon,
          total: new Prisma.Decimal(t.amount),
          quantidade: 1,
        });
      }
    }

    return Array.from(grouped.values())
      .map((item) => ({ ...item, total: Number(item.total) }))
      .sort((a, b) => b.total - a.total);
  }

  async getMonthlyEvolution(userId: string, { year }: YearFilterDTO) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      select: { type: true, amount: true, date: true },
      orderBy: { date: 'asc' },
    });

    const months = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      nomeMes: new Date(year, i, 1).toLocaleString('pt-BR', { month: 'long' }),
      receitas: 0,
      despesas: 0,
      saldo: 0,
    }));

    for (const t of transactions) {
      const month = t.date.getMonth();
      const amount = Number(t.amount);

      if (t.type === 'RECEITA') {
        months[month].receitas += amount;
      } else {
        months[month].despesas += amount;
      }
      months[month].saldo = months[month].receitas - months[month].despesas;
    }

    return { ano: year, meses: months };
  }

  async exportCSV(userId: string, { startDate, endDate }: PeriodFilterDTO) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: { category: true },
      orderBy: { date: 'desc' },
    });

    const header = 'Título,Tipo,Valor,Category,Data,Descrição\n';

    const rows = transactions.map((t) => {
      const date = t.date.toLocaleDateString('pt-BR');
      const amount = Number(t.amount).toFixed(2);
      const description = t.description ?? '';
      return `"${t.title}","${t.type}","${amount}","${t.category.name}", "${date}","${description}"`;
    });

    return header + rows.join('\n');
  }
}
