import { Hono } from "hono";
import type { AppBindings } from "../../types";

const frontProducts = new Hono<AppBindings>();

export default frontProducts;
