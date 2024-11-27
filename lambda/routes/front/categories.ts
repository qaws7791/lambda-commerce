import { Hono } from "hono";
import type { AppBindings } from "../../types";
import { categories } from "../../db/schema";
import { eq } from "drizzle-orm";
import db from "../../db";

const frontCategories = new Hono<AppBindings>();

frontCategories
  .get("/", async (c) => {
    const data = await db.select().from(categories).all();
    return c.json(data);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(id)))
      .get();
    return c.json(data);
  });

export default frontCategories;
