import { Hono } from "hono";
import type { AppBindings } from "../../types";
import { zValidator } from "@hono/zod-validator";
import {
  emailLoginBodySchema,
  emailRegisterBodySchema,
} from "../../validations/auth";

import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, signJWT, verifyPassword } from "../../helpers/auth";
import { JWTPayload } from "hono/utils/jwt/types";
import db from "../../db";
import { env } from "hono/adapter";
const frontAuth = new Hono<AppBindings>();

frontAuth
  .post("/login", zValidator("json", emailLoginBodySchema), async (c) => {
    // initialize
    const { email, password } = c.req.valid("json");

    // check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    // check if password is correct
    const isPasswordCorrect = await verifyPassword(user.password, password);
    if (!isPasswordCorrect) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    // generate token
    const currentTime = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: currentTime,
      exp: currentTime + 60 * 5, // 5 minutes
    };
    const token = await signJWT(payload, env(c).JWT_SECRET);

    return c.json({ token });
  })
  .post("/register", zValidator("json", emailRegisterBodySchema), async (c) => {
    // initialize
    try {
      const { email, password, username } = c.req.valid("json");

      // check if user exists
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();

      if (user) {
        return c.json({ message: "Email already exists" }, 400);
      }

      // hash password
      const hashedPassword = await hashPassword(password);

      // insert user
      await db.insert(users).values({
        email,
        password: hashedPassword,
        username,
        role: "user",
      });

      return c.json({ message: "User registered" });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Error registering user" }, 500);
    }
  });

export default frontAuth;
