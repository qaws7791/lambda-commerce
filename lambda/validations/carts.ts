import { z } from "zod";

export const addItemToCart = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const updateCartItem = z.object({
  cartItemId: z.number(),
  quantity: z.number().min(1),
});

export const removeCartItem = z.object({
  cartItemId: z.number(),
});
