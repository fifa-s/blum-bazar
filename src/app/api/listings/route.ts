import { db } from "@/db";
import { listings } from "@/db/schemas";

export interface ListingsResponse {
  id: number;
  itemName: string;
  itemDescription: string | null;
  itemCategory: string;
  itemPrice: number;
  contactName: string | null;
  contactEmail: string | null;
  listingState: string;
}

export function GET() {
  const listingsData = db
    .select({
      id: listings.id,
      itemName: listings.itemName,
      itemDescription: listings.itemDescription,
      itemCategory: listings.itemCategory,
      itemPrice: listings.itemPrice,
      contactName: listings.contactName,
      contactEmail: listings.contactEmail,
      listingState: listings.listingState,
    })
    .from(listings)
    .all();

  const response: ListingsResponse[] = listingsData.map((l) => ({
    id: l.id,
    itemName: l.itemName,
    itemDescription: l.itemDescription,
    itemCategory: l.itemCategory,
    itemPrice: l.itemPrice,
    contactName: l.contactName,
    contactEmail: l.contactEmail,
    listingState: l.listingState,
  }));

  return Response.json(response);
}
