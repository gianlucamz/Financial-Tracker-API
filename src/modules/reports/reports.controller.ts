import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { periodFilterSchema, yearFilterSchema } from './reports.dto';

const reportsService = new ReportsService();

export class ReportsController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = periodFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const summary = await reportsService.getSummary(req.userId, parsed.data);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = periodFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const report = await reportsService.getByCategory(req.userId, parsed.data);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyEvolution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = yearFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const evolution = await reportsService.getMonthlyEvolution(req.userId, parsed.data);
      res.status(200).json(evolution);
    } catch (error) {
      next(error);
    }
  }

  async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = periodFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const csv = await reportsService.exportCSV(req.userId, parsed.data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Dispostion', 'attachment; filename="transacoes.csv"');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}
