import { Hono } from "hono";
import type { AppBindings } from "../../types";
import { categories } from "../../db/schema";
import { desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { numberIdSchema, pagingSchema } from "../../validations/common";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../../constants";
import {
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from "../../validations/categories";
import db from "../../db";

const adminCategories = new Hono<AppBindings>();

adminCategories
  .get("/", zValidator("query", pagingSchema), async (c) => {
    // initialize
    const query = c.req.valid("query");
    const page = query.page || DEFAULT_PAGE;
    const limit = query.limit || DEFAULT_LIMIT;

    // pagination
    const data = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.id))
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
      .from(categories)
      .where(eq(categories.id, id))
      .get();

    // return
    return c.json(data);
  })
  .post("/", zValidator("json", createCategoryBodySchema), async (c) => {
    // initialize
    const input = c.req.valid("json");

    // insert
    const data = await db.insert(categories).values(input).returning();

    // return
    return c.json(data, 201);
  })
  .patch(
    "/:id",
    zValidator("param", numberIdSchema),
    zValidator("json", updateCategoryBodySchema),
    async (c) => {
      // initialize
      const id = c.req.valid("param").id;
      const input = c.req.valid("json");

      // update
      const data = await db
        .update(categories)
        .set(input)
        .where(eq(categories.id, id))
        .returning();

      return c.json(data);
    }
  )
  .delete("/:id", zValidator("param", numberIdSchema), async (c) => {
    // initialize
    const id = c.req.valid("param").id;

    // delete
    await db.delete(categories).where(eq(categories.id, id));
    return c.text("Deleted!", 204);
  });

export default adminCategories;
