import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { department } from "./department";
import { designation } from "./designation";

export const userProfile = sqliteTable(
  "user_profile",
  {
    id: text("id").primaryKey(), // nano id
    user_id: text("user_id")
      .unique()
      .notNull()
      .references(() => user.id, { onUpdate: "restrict", onDelete: "restrict" }),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    zipcode: text("zipcode"),
    designation_id: text("designation_id")
      .notNull()
      .references(() => designation.id, { onUpdate: "restrict", onDelete: "restrict" }),
    department_id: text("department_id")
      .notNull()
      .references(() => department.id, { onUpdate: "restrict", onDelete: "restrict" }),
    date_of_joining: integer("date_of_joining", { mode: "timestamp_ms" }),
    date_of_leaving: integer("date_of_leaving", { mode: "timestamp_ms" }),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    created_by: text("created_by").notNull(),
    updated_by: text("updated_by").notNull(),
  },
  (table) => [
    index("idx_user_profile_user_id").on(table.user_id),
    index("idx_user_profile_foreign_keys").on(table.user_id, table.designation_id, table.department_id),
  ],
);
