import { handle } from "hono/aws-lambda";
import { env } from "hono/adapter";
import { Hono } from "hono";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import type { AppBindings } from "./types";
import { cors } from "hono/cors";
import adminCategories from "./routes/admin/categories";
import adminProducts from "./routes/admin/products";
import frontCategories from "./routes/front/categories";
import frontProducts from "./routes/front/products";
import frontAuth from "./routes/front/auth";

const app = new Hono<AppBindings>({
  strict: false,
});

app.use(cors());
app.use(serveEmojiFavicon("🔥"));

// Admin Routes(For Admin)
app.route("/admin/categories", adminCategories);
app.route("/admin/products", adminProducts);

// Front Routes(For Users)
app.route("/front/auth", frontAuth);
app.route("/front/categories", frontCategories);
app.route("/front/products", frontProducts);

app.get("/", (c) => {
  const { JWT_SECRET } = env(c);

  return c.json({
    message: "Hello, World!",
    JWT_SECRET: JWT_SECRET
      ? JWT_SECRET
      : "No JWT_SECRET found in environment variables",
  });
});

app.onError(onError);
app.notFound(notFound);

export const handler = handle(app);
