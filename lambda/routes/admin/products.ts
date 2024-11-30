import { Hono } from "hono";
import type { AppBindings } from "../../types";

import { products } from "../../db/schema";
import { desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { numberIdSchema } from "../../validations/common";
import {
  createProductBodySchema,
  productPagingSchema,
  updateProductBodySchema,
} from "../../validations/products";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../../constants";
import db from "../../db";

const adminProducts = new Hono<AppBindings>();

adminProducts
  .get("/", zValidator("query", productPagingSchema), async (c) => {
    // initialize
    const query = c.req.valid("query");
    const category = query.category;
    const page = query.page || DEFAULT_PAGE;
    const limit = query.limit || DEFAULT_LIMIT;

    // pagination
    const data = await db
      .select()
      .from(products)
      .where(category ? eq(products.categoryId, category) : undefined)
      .orderBy(desc(products.id))
      .limit(limit)
      .offset((page - 1) * limit);

    // return
    return c.json(data);
  })
  .get("/:id", zValidator("param", numberIdSchema), async (c) => {
    // initialize
    const id = c.req.valid("param").id;

    // query
    const data = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();

    // return
    return c.json(data);
  })
  .post("/", zValidator("json", createProductBodySchema), async (c) => {
    // initialize
    const input = c.req.valid("json");

    // insert
    const data = await db.insert(products).values(input).returning();

    // return
    return c.json(data, 201);
  })
  .patch(
    "/:id",
    zValidator("param", numberIdSchema),
    zValidator("json", updateProductBodySchema),
    async (c) => {
      // initialize

      const id = c.req.valid("param").id;
      const input = c.req.valid("json");

      // update
      const data = await db
        .update(products)
        .set(input)
        .where(eq(products.id, id))
        .returning();

      // return
      return c.json(data);
    }
  )
  .delete("/:id", zValidator("param", numberIdSchema), async (c) => {
    // initialize
    const id = c.req.valid("param").id;

    // delete
    await db.delete(products).where(eq(products.id, id));

    // return
    return c.text("Deleted!", 204);
  });

export default adminProducts;
