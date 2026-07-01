import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const reportsController = new ReportsController();

router.use(authMiddleware);

router.get('/summary', (req, res, next) => reportsController.getSummary(req, res, next));
router.get('/by-category', (req, res, next) => reportsController.getByCategory(req, res, next));
router.get('/monthly-evolution', (req, res, next) =>
  reportsController.getMonthlyEvolution(req, res, next),
);
router.get('/export/csv', (req, res, next) => reportsController.exportCSV(req, res, next));

export default router;
