"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { listings } from "@/db/schemas";

export async function reserveListing(listingId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));

  if (!listing) throw new Error("Listing not found");
  if (listing.listingState !== "available") throw new Error("Listing is not available");

  await db
    .update(listings)
    .set({ listingState: "reserved", reservedById: session.user.id })
    .where(eq(listings.id, listingId));
}

export async function markListingAsSold(listingId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));

  if (!listing) throw new Error("Listing not found");
  if (listing.authorId !== session.user.id) throw new Error("Not authorized");
  if (listing.listingState === "sold") throw new Error("Already sold");

  await db.update(listings).set({ listingState: "sold" }).where(eq(listings.id, listingId));
}

export async function cancelReservation(listingId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));

  if (!listing) throw new Error("Listing not found");
  if (listing.listingState !== "reserved") throw new Error("Listing is not reserved");

  // Only the reserver or the author can cancel
  const isReserver = listing.reservedById === session.user.id;
  const isAuthor = listing.authorId === session.user.id;
  if (!isReserver && !isAuthor) throw new Error("Not authorized");

  await db.update(listings).set({ listingState: "available", reservedById: null }).where(eq(listings.id, listingId));
}

export async function relisting(listingId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));

  if (!listing) throw new Error("Listing not found");
  if (listing.listingState !== "sold") throw new Error("Listing is not sold");
  if (listing.authorId !== session.user.id) throw new Error("Not authorized");

  await db.update(listings).set({ listingState: "available" }).where(eq(listings.id, listingId));
}
