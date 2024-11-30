import { Context } from "hono";
import { AppBindings } from "../types";
import { verifyJWT } from "../helpers/auth";
import { env } from "hono/adapter";

export default async function userGuard(
  c: Context<AppBindings>,
  next: () => Promise<void>
) {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const jwtPayload = await verifyJWT(token, env(c).JWT_SECRET);
  if (!jwtPayload?.role) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }
  c.set("jwtPayload", jwtPayload);
  return next();
}
