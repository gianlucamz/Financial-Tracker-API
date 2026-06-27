import { Router } from 'express';
import { TransactionController } from './transactions.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const transactionsController = new TransactionController();

router.use(authMiddleware);

router.post('/', (req, res, next) => transactionsController.create(req, res, next));
router.get('/', (req, res, next) => transactionsController.findAll(req, res, next));
router.get('/:id', (req, res, next) => transactionsController.findById(req, res, next));
router.put('/:id', (req, res, next) => transactionsController.update(req, res, next));
router.delete('/:id', (req, res, next) => transactionsController.delete(req, res, next));

export default router;
