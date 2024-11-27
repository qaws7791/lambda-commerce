import { z } from "zod";

export const createCategoryBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
});

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
});
