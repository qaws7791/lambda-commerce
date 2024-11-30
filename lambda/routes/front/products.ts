import { Hono } from "hono";
import type { AppBindings } from "../../types";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../../constants";
import db from "../../db";
import { numberIdSchema } from "../../validations/common";
import { products } from "../../db/schema";
import { productPagingSchema } from "../../validations/products";

const frontProducts = new Hono<AppBindings>();

frontProducts
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
  });

export default frontProducts;
