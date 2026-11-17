import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";
import * as schema from "@/db/schema";
import { defineRelations } from "drizzle-orm";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const relations = defineRelations(schema);

export const db = drizzle({ client, relations });
