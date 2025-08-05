import { text, integer, sqliteTable, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export enum Role {
  Admin = "ADMIN",
  Manager = "MANAGER",
  Viewer = "VIEWER",
}

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(), // nano id
    emp_code: text("emp_code").unique().notNull(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: text("role", { enum: ["ADMIN", "MANAGER", "VIEWER"] })
      .notNull()
      .$type<Role>(),
    phone: text("phone").unique().notNull(),
    last_login_at: integer("last_login_at", { mode: "timestamp_ms" }),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    created_by: text("created_by").notNull(),
    updated_by: text("updated_by").notNull(),
    force_password_change: integer("force_password_change", { mode: "boolean" }).default(false),
    is_verified: integer("is_verified", { mode: "boolean" }).default(false),
    is_disabled: integer("is_disabled", { mode: "boolean" }).default(false),
  },
  (table) => [
    index("idx_email").on(table.email),
    index("idx_phone").on(table.phone),
    index("idx_emp_code").on(table.emp_code),
    uniqueIndex("composite_email_phone").on(table.email, table.phone),
  ],
);
