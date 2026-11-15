import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v4 } from "uuid";

export const pssnsTable = sqliteTable("pssns", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  body: text("name").notNull(),
  score: real("score").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
