import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { createCategorySchema, updateCategorySchema, categoryParamsSchema } from './categories.dto';

const categoriesService = new CategoriesService();

export class CategoriesController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createCategorySchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }

      const category = await categoriesService.create(req.userId, parsed.data);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoriesService.findAll(req.userId);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = categoryParamsSchema.safeParse(req.params);
      if (!params.success) {
        res.status(400).json({ error: params.error.issues[0].message });
        return;
      }
      const category = await categoriesService.findById(req.userId, params.data.id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = categoryParamsSchema.safeParse(req.params);
      if (!params.success) {
        res.status(400).json({ error: params.error.issues[0].message });
        return;
      }
      const parsed = updateCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const category = await categoriesService.update(req.userId, params.data.id, parsed.data);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = categoryParamsSchema.safeParse(req.params);
      if (!params.success) {
        res.status(400).json({ error: params.error.issues[0].message });
        return;
      }
      await categoriesService.delete(req.userId, params.data.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
