import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";

const databaseUrl = process.env.DATABASE_URL;
const databaseToken = process.env.DATABASE_TOKEN;

if (!databaseUrl || !databaseToken) {
  throw new Error("DATABASE_URL is required");
}

const client = createClient({
  url: databaseUrl,
  authToken: databaseToken,
});

const db = drizzle({
  client,
});

export default db;
