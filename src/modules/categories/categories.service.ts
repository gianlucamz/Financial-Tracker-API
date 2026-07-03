import prisma from '../../config/prisma';
import { AppError } from '../../shared/errors/AppError';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.dto';

export class CategoriesService {
  async create(userId: string, data: CreateCategoryDTO) {
    const category = await prisma.category.create({
      data: { ...data, userId },
    });
    return category;
  }

  async findAll(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return categories;
  }

  async findById(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    return category;
  }

  async update(userId: string, categoryId: string, data: UpdateCategoryDTO) {
    await this.findById(userId, categoryId);

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    return updated;
  }

  async delete(userId: string, categoryId: string) {
    await this.findById(userId, categoryId);

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
