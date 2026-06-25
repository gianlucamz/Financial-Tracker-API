import 'dotenv/config';
import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Financial Tracker API funcionando!' });
});

app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
