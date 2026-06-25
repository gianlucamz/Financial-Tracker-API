import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const categoriesController = new CategoriesController();

router.use(authMiddleware);

router.post('/', (req, res, next) => categoriesController.create(req, res, next));
router.get('/', (req, res, next) => categoriesController.findAll(req, res, next));
router.get('/:id', (req, res, next) => categoriesController.findById(req, res, next));
router.put('/:id', (req, res, next) => categoriesController.update(req, res, next));
router.delete('/:id', (req, res, next) => categoriesController.delete(req, res, next));

export default router;
