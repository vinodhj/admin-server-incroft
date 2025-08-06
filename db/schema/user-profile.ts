import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { department } from "./department";
import { designation } from "./designation";

// Enum definitions
export enum EmploymentType {
  Contract = "CONTRACT",
  FullTime = "FULL_TIME",
  Intern = "INTERN",
  PartTime = "PART_TIME",
}

export enum WorkLocation {
  Hybrid = "HYBRID",
  Office = "OFFICE",
  Remote = "REMOTE",
}

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
  Other = "OTHER",
  PreferNotToSay = "PREFER_NOT_TO_SAY",
}

export enum MaritalStatus {
  Divorced = "DIVORCED",
  Married = "MARRIED",
  Single = "SINGLE",
  Widowed = "WIDOWED",
}

// Type definitions for JSON fields
export type EmergencyContactDetails = {
  name?: string;
  phone?: string;
  email?: string;
  relationship?: string;
};

export type HRAndCompliance = {
  pan_number?: string;
  aadhar_number?: string;
  passport_number?: string;
  visa_status?: string;
};

export type PayrollDetails = {
  bank_account_number?: string;
  bank_name?: string;
  ifsc_code?: string;
  pf_number?: string;
};

export const userProfile = sqliteTable(
  "user_profile",
  {
    id: text("id").primaryKey(), // nano id
    user_id: text("user_id")
      .unique()
      .notNull()
      .references(() => user.id, { onUpdate: "restrict", onDelete: "restrict" }),
    // Address Information
    address: text("address"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    zipcode: text("zipcode"),
    // Personal Information
    employee_photo_url: text("employee_photo_url"),
    personal_email: text("personal_email"),
    date_of_birth: integer("date_of_birth", { mode: "timestamp_ms" }),
    gender: text("gender", { enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] }).$type<Gender>(),
    marital_status: text("marital_status", { enum: ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"] }).$type<MaritalStatus>(),

    // Employment Information
    designation_id: text("designation_id")
      .notNull()
      .references(() => designation.id, { onUpdate: "restrict", onDelete: "restrict" }),
    department_id: text("department_id")
      .notNull()
      .references(() => department.id, { onUpdate: "restrict", onDelete: "restrict" }),
    employment_type: text("employment_type", { enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"] })
      .notNull()
      .$type<EmploymentType>(),
    work_location: text("work_location", { enum: ["OFFICE", "HYBRID", "REMOTE"] })
      .notNull()
      .$type<WorkLocation>(),
    date_of_joining: integer("date_of_joining", { mode: "timestamp_ms" }),
    date_of_leaving: integer("date_of_leaving", { mode: "timestamp_ms" }),

    // JSON Fields for Grouped Data
    emergency_contact_details: text("emergency_contact_details", { mode: "json" }).$type<EmergencyContactDetails>(),
    hr_and_compliance: text("hr_and_compliance", { mode: "json" }).$type<HRAndCompliance>(),
    payroll_details: text("payroll_details", { mode: "json" }).$type<PayrollDetails>(),

    // Audit Fields
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
    index("idx_user_profile_employment").on(table.employment_type, table.work_location),
  ],
);
