import { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
  Bindings: {
    SECRET_KEY: string;
    JWT_SECRET: string;
  };
}
