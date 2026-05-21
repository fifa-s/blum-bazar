import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listings = sqliteTable("listings", {
  id: integer().primaryKey({ autoIncrement: true }),
  itemName: text().notNull(),
  itemDescription: text(),
  itemCategory: text().notNull(),
  itemPrice: integer().notNull(),
  contactName: text(),
  contactEmail: text().notNull(),
  listingState: text().notNull(),
});

export type Listings = typeof listings.$inferSelect;
