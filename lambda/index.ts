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
import { pinoLogger } from "hono-pino";
import { jwt } from "hono/jwt";
import userGuard from "./guards/user.guard";
import frontCarts from "./routes/front/carts";

const app = new Hono<AppBindings>({
  strict: false,
});
app.use(pinoLogger());
app.use(cors());
app.use(serveEmojiFavicon("🔥"));

app.use("/admin/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: env(c).JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

// Admin Routes(For Admin)
app.route("/admin/categories", adminCategories);
app.route("/admin/products", adminProducts);

// Front Routes(For Users)
app.route("/front/auth", frontAuth);
app.route("/front/categories", frontCategories);
app.route("/front/products", frontProducts);
app.route("/front/carts", frontCarts);

app.get("/", async (c) => {
  return c.json({
    message: "Hello, World!",
    jwtSecret: env(c).JWT_SECRET,
  });
});

app.get("/protected", userGuard, async (c) => {
  return c.json({
    message: "Protected Route",
    jwtPayload: c.get("jwtPayload"),
  });
});

app.onError(onError);
app.notFound(notFound);

export const handler = handle(app);
