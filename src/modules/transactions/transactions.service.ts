import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../shared/errors/AppError';
import {
  CreateTransactionDTO,
  TransactionFiltersDTO,
  UpdateTransactionDTO,
} from './transactions.dto';

export class TransactionService {
  async create(userId: string, data: CreateTransactionDTO) {
    const categoryExists = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!categoryExists) {
      throw new AppError('Categoria não encontrada ou não pertence ao usuário.', 404);
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        amount: new Prisma.Decimal(data.amount),
        userId,
      },
      include: { category: true },
    });

    return transaction;
  }

  async findAll(userId: string, filters: TransactionFiltersDTO) {
    const { type, categoryId, startDate, endDate, page, limit } = filters;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, transactionId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: { category: true },
    });

    if (!transaction) {
      throw new AppError('Transação não encontrada.', 404);
    }

    return transaction;
  }

  async update(userId: string, transactionId: string, data: UpdateTransactionDTO) {
    await this.findById(userId, transactionId);

    if (data.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!categoryExists) {
        throw new AppError('Categoria não encontrada ou não pertence ao usuário.', 404);
      }
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...data,
        ...(data.amount && { amount: new Prisma.Decimal(data.amount) }),
      },
      include: { category: true },
    });

    return updated;
  }

  async delete(userId: string, transactionId: string) {
    await this.findById(userId, transactionId);

    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  }
}
