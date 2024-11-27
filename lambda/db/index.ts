import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";

const client = createClient({
  url: "libsql://commerce-qaws7791.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjQyNzQ5NTAsImlhdCI6MTczMjczODk1MCwiaWQiOiJhYjY5YmZhYi1kN2FhLTRmZjYtOGFhYS0wM2QxODIwMjY2MjkifQ.tqkHnslDn4zo-SFaNPquubJ0bKVwweEgwtPDprSk0DFnF9a8JI0RyILrExQPcOs3j3LUQWyZGWGK186uLqbRDA",
});

const db = drizzle({
  client,
});

export default db;
