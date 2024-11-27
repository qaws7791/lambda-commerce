import { z } from "zod";

export const emailLoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().max(50),
});

export const emailRegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().max(50),
  username: z.string().max(50),
});
