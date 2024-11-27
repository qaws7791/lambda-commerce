import { z } from "zod";

export const pagingSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const numberIdSchema = z.object({
  id: z.coerce.number().min(1),
});
