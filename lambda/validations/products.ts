import { z } from "zod";

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number().min(0),
  stock: z.number().min(0),
  categoryId: z.number(),
  image: z.string().url(),
  description: z.string(),
});

export const updateProductBodySchema = z.object({
  name: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  categoryId: z.number().optional(),
  image: z.string().url().optional(),
  description: z.string().optional(),
});
