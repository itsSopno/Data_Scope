import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "analyst", "viewer"] }).notNull().default("viewer"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Roles Table
export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().default([]).notNull(),
});

// 3. Datasets Table
export const datasets = pgTable("datasets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  totalRecords: integer("total_records").notNull().default(0),
  accessPermissions: jsonb("access_permissions").$type<string[]>().default(["admin", "analyst", "viewer"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Dataset Fields Table (Metadata schema for dynamic tables)
export const datasetFields = pgTable("dataset_fields", {
  id: text("id").primaryKey(),
  datasetId: text("dataset_id").references(() => datasets.id, { onDelete: "cascade" }).notNull(),
  fieldName: text("field_name").notNull(),
  fieldType: text("field_type").notNull(), // text, number, date, boolean, json
  isFilterable: boolean("is_filterable").default(true).notNull(),
  isSortable: boolean("is_sortable").default(true).notNull(),
});

// 5. Dataset Records Table (Optimized for 100,000+ Records Search)
export const datasetRecords = pgTable(
  "dataset_records",
  {
    id: text("id").primaryKey(),
    datasetId: text("dataset_id").references(() => datasets.id, { onDelete: "cascade" }).notNull(),
    recordNumber: text("record_number").notNull(),
    customerName: text("customer_name").notNull(),
    company: text("company").notNull(),
    email: text("email").notNull(),
    country: text("country").notNull(),
    city: text("city").notNull(),
    status: text("status", { enum: ["Active", "Pending", "Suspended", "Archived"] }).notNull().default("Active"),
    tier: text("tier", { enum: ["Enterprise", "Growth", "Starter"] }).notNull().default("Starter"),
    revenue: integer("revenue").notNull().default(0),
    dealSize: integer("deal_size").notNull().default(0),
    churnRisk: text("churn_risk", { enum: ["Low", "Medium", "High"] }).notNull().default("Low"),
    score: integer("score").notNull().default(50),
    metadata: jsonb("metadata").default({}),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Standard B-Tree Indexes for fast filtering & sorting
    index("idx_records_dataset_id").on(table.datasetId),
    index("idx_records_status").on(table.status),
    index("idx_records_country").on(table.country),
    index("idx_records_tier").on(table.tier),
    index("idx_records_revenue").on(table.revenue),
    index("idx_records_created_at").on(table.createdAt),

    // Composite Index for high-frequency combined filter queries
    index("idx_records_composite_filter").on(table.datasetId, table.status, table.country, table.revenue),
  ]
);

// 6. Record Relationships Table
export const recordRelationships = pgTable("record_relationships", {
  id: text("id").primaryKey(),
  primaryRecordId: text("primary_record_id").references(() => datasetRecords.id, { onDelete: "cascade" }).notNull(),
  relatedRecordId: text("related_record_id").references(() => datasetRecords.id, { onDelete: "cascade" }).notNull(),
  relationshipType: text("relationship_type").notNull(), // Parent Company, Subsidiary, Partner, Vendor
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Saved Views Table
export const savedViews = pgTable("saved_views", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  datasetId: text("dataset_id").references(() => datasets.id, { onDelete: "cascade" }).notNull(),
  searchConditions: jsonb("search_conditions").notNull(),
  visibleColumns: jsonb("visible_columns").$type<string[]>().notNull(),
  isShared: boolean("is_shared").default(true).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Search History Table
export const searchHistory = pgTable("search_history", {
  id: text("id").primaryKey(),
  querySummary: text("query_summary").notNull(),
  datasetId: text("dataset_id").references(() => datasets.id, { onDelete: "cascade" }).notNull(),
  filtersCount: integer("filters_count").notNull().default(0),
  recordsCount: integer("records_count").notNull().default(0),
  executionTimeMs: integer("execution_time_ms").notNull().default(0),
  searchState: jsonb("search_state").notNull(),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

// 9. User Preferences Table
export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  theme: text("theme").default("dark").notNull(),
  density: text("density").default("standard").notNull(),
  defaultColumns: jsonb("default_columns").$type<string[]>().default([]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions inferred from Drizzle schema
export type DbUser = typeof users.$inferSelect;
export type NewDbUser = typeof users.$inferInsert;
export type DbDataset = typeof datasets.$inferSelect;
export type NewDbDataset = typeof datasets.$inferInsert;
export type DbDatasetRecord = typeof datasetRecords.$inferSelect;
export type NewDbDatasetRecord = typeof datasetRecords.$inferInsert;
export type DbSavedView = typeof savedViews.$inferSelect;
export type NewDbSavedView = typeof savedViews.$inferInsert;

