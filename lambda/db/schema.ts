import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),

  role: text("role", {
    enum: ["admin", "user"],
  })
    .default("user")
    .notNull(),

  email: text("email", {
    length: 255,
  }).notNull(),

  username: text("username", {
    length: 255,
  }).notNull(),

  password: text("password", {
    length: 1000,
  }).notNull(),

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),

  name: text("name", {
    length: 255,
  }).notNull(),

  description: text("description", {
    length: 1000,
  }).notNull(),

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const products = sqliteTable("products", {
  id: integer("id", {
    mode: "number",
  }).primaryKey({ autoIncrement: true }),

  // 이미지 url을 저장할 수 있는 필드
  image: text("image", {
    length: 1000,
  }).notNull(),

  name: text("name", {
    length: 255,
  }).notNull(),

  description: text("description", {
    length: 1000,
  }).notNull(),

  price: integer("price", {
    mode: "number",
  }).notNull(),

  stock: integer("stock", {
    mode: "number",
  }).notNull(),

  categoryId: integer("category_id", {
    mode: "number",
  }).notNull(),

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
