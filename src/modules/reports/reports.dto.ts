import { z } from 'zod';

export const periodFilterSchema = z
  .object({
    startDate: z.coerce.date({ errorMap: () => ({ message: 'Data inicial inválida.' }) }),
    endDate: z.coerce.date({ errorMap: () => ({ message: 'Data final inválida.' }) }),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Data inicial deve ser anterior à data final.',
    path: ['startDate'],
  });

export const yearFilterSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000, 'Ano inválido.')
    .max(2100, 'Ano inválido.')
    .default(new Date().getFullYear()),
});

export type PeriodFilterDTO = z.infer<typeof periodFilterSchema>;
export type YearFilterDTO = z.infer<typeof yearFilterSchema>;
