import {
  pgTable,
  serial,
  varchar,
  text,
  real,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";

/**
 * Users table — deduplicated by email.
 * Any contact (location suggestion, contact form) upserts here.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Location suggestions — one user can suggest multiple locations,
 * but not the same location twice (deduplicated by user + rounded coords).
 * Coordinates are rounded to 4 decimal places (~11m precision) for dedup.
 */
export const locationSuggestions = pgTable(
  "location_suggestions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    // Rounded coords for deduplication (4 decimals ≈ 11m)
    latRounded: integer("lat_rounded").notNull(), // lat * 10000, truncated
    lngRounded: integer("lng_rounded").notNull(), // lng * 10000, truncated
    address: text("address"),
    note: text("note"),
    // Admin-managed fields
    imageUrl: text("image_url"), // Photo of the location (managed by admin)
    status: varchar("status", { length: 50 }).default("pending").notNull(), // pending | approved | featured
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Prevent same user from suggesting the same spot twice
    uniqueIndex("unique_user_location").on(
      table.userId,
      table.latRounded,
      table.lngRounded
    ),
  ]
);

/**
 * Votes — one user can vote for a location once.
 * Used for community voting on suggested locations.
 */
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    locationId: integer("location_id")
      .notNull()
      .references(() => locationSuggestions.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // One vote per user per location
    uniqueIndex("unique_user_vote").on(table.userId, table.locationId),
  ]
);
