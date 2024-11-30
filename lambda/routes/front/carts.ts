import { Hono } from "hono";
import { AppBindings } from "../../types";
import db from "../../db";
import { cartItems, carts, products, users } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { numberIdSchema } from "../../validations/common";
import {
  addItemToCart,
  removeCartItem,
  updateCartItem,
} from "../../validations/carts";
import userGuard from "../../guards/user.guard";

const frontCarts = new Hono<AppBindings>();

frontCarts
  .get("/", userGuard, async (c) => {
    // 사용자의 카트 정보를 반환합니다
    // get user
    const session = c.get("jwtPayload");

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(session.sub)))
      .get();

    if (!user) {
      return c.json({ message: "User not found" }, { status: 401 });
    }

    // get cart with cart items
    let existingCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, user.id))
      .get();

    if (!existingCart) {
      [existingCart] = await db
        .insert(carts)
        .values({
          userId: user.id,
        })
        .returning();
    }

    const existingCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, existingCart.id))
      .leftJoin(products, eq(cartItems.productId, products.id))
      .all();

    return c.json({
      ...existingCart,
      items: existingCartItems.map((item) => {
        const {
          products,
          cart_items: { productId, ...cartItems },
        } = item;

        return {
          product: products,
          ...cartItems,
        };
      }),
    });
  })
  .post(
    "/:id/add",
    userGuard,
    zValidator("param", numberIdSchema),
    zValidator("json", addItemToCart),
    async (c) => {
      const cartId = c.req.valid("param").id;
      const body = c.req.valid("json");
      const session = c.get("jwtPayload");

      // check user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(session.sub)))
        .get();

      if (!user) {
        return c.json({ message: "User not found" }, { status: 401 });
      }

      const existingCart = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, user.id), eq(carts.id, cartId)))
        .get();

      if (!existingCart) {
        return c.json({ message: "Cart not found" }, { status: 404 });
      }

      // get existing cart item

      const existingCartItem = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cartId),
            eq(cartItems.productId, body.productId)
          )
        )
        .get();

      if (existingCartItem) {
        const cartItem = await db
          .update(cartItems)
          .set({
            quantity: existingCartItem.quantity + body.quantity,
          })
          .where(eq(cartItems.id, existingCartItem.id))
          .returning();

        return c.json(cartItem[0]);
      } else {
        const cartItem = await db
          .insert(cartItems)
          .values({
            cartId: cartId,
            productId: body.productId,
            quantity: body.quantity,
          })
          .returning();

        return c.json(cartItem[0]);
      }
    }
  )
  .post(
    "/:id/update",
    userGuard,
    zValidator("param", numberIdSchema),
    zValidator("json", updateCartItem),
    async (c) => {
      const cartId = c.req.valid("param").id;
      const body = c.req.valid("json");
      const session = c.get("jwtPayload");

      // check user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(session.sub)))
        .get();

      if (!user) {
        return c.json({ message: "User not found" }, { status: 401 });
      }

      const existingCart = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, user.id), eq(carts.id, cartId)))
        .get();

      if (!existingCart) {
        return c.json({ message: "Cart not found" }, { status: 404 });
      }

      // get existing cart item

      const existingCartItem = await db
        .select()
        .from(cartItems)
        .where(
          and(eq(cartItems.cartId, cartId), eq(cartItems.id, body.cartItemId))
        )
        .get();

      if (!existingCartItem) {
        return c.json({ message: "Cart item not found" }, { status: 404 });
      }

      const cartItem = await db
        .update(cartItems)
        .set({
          quantity: body.quantity,
        })
        .where(eq(cartItems.id, existingCartItem.id))
        .returning();

      return c.json(cartItem[0]);
    }
  )
  .post(
    "/:id/remove",
    userGuard,
    zValidator("param", numberIdSchema),
    zValidator("json", removeCartItem),
    async (c) => {
      const cartId = c.req.valid("param").id;
      const body = c.req.valid("json");
      const session = c.get("jwtPayload");

      // check user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(session.sub)))
        .get();

      if (!user) {
        return c.json({ message: "User not found" }, { status: 401 });
      }

      const existingCart = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, user.id), eq(carts.id, cartId)))
        .get();

      if (!existingCart) {
        return c.json({ message: "Cart not found" }, { status: 404 });
      }

      // get existing cart item

      const existingCartItem = await db
        .select()
        .from(cartItems)
        .where(
          and(eq(cartItems.cartId, cartId), eq(cartItems.id, body.cartItemId))
        )
        .get();

      if (!existingCartItem) {
        return c.json({ message: "Cart item not found" }, { status: 404 });
      }

      const cartItem = await db
        .delete(cartItems)
        .where(eq(cartItems.id, existingCartItem.id))
        .returning();

      return c.json(cartItem[0]);
    }
  );

export default frontCarts;
