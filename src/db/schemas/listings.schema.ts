import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const listings = sqliteTable("listings", {
  id: integer().primaryKey({ autoIncrement: true }),
  itemName: text().notNull(),
  itemDescription: text(),
  itemCategory: text().notNull(),
  itemPrice: integer().notNull(),
  contactName: text().notNull(),
  contactEmail: text().notNull(),
  listingState: text().notNull(),
  imagePath: text(),
  authorId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reservedById: text().references(() => users.id, { onDelete: "cascade" }),
});

export type Listings = typeof listings.$inferSelect;
