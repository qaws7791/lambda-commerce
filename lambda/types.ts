import { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    jwtPayload: {
      sub: string;
      role: "admin" | "user";
      iat: number;
      exp: number;
    };
  };
  Bindings: {
    SECRET_KEY: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    DATABASE_TOKEN: string;
  };
  Context: {};
}
