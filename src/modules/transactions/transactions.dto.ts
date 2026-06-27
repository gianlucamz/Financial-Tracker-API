import { z } from 'zod';

export const createTransactionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório.').max(100, 'Título muito longo.'),
  amount: z
    .number({ invalid_type_error: 'Valor deve ser um número.' })
    .positive('Valor deve ser maior que zero.'),
  type: z.enum(['RECEITA', 'DESPESA'], {
    errorMap: () => ({ message: 'Tipo deve ser uma RECEITA ou DESPESA.' }),
  }),
  date: z.coerce.date({ errorMap: () => ({ message: 'Data inválida.' }) }),
  description: z.string().max(255, 'Descrição muito longa.').optional(),
  categoryId: z.string().uuid('ID de categoria inválido'),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionParamsSchema = z.object({
  id: z.string().uuid('ID inválido.'),
});

export const transactionFiltersSchema = z.object({
  type: z.enum(['RECEITA', 'DESPESA']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type TransactionFiltersDTO = z.infer<typeof transactionFiltersSchema>;
