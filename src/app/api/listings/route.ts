import { db } from "@/db";
import { listings } from "@/db/schemas";
import {
  validateContactName,
  validateEmail,
  validateItemCategory,
  validateItemDescription,
  validateItemName,
  validatePrice,
  validateState,
} from "@/helpers/validators";

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
  try {
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
  } catch (_error) {
    return new Response(JSON.stringify({ ok: false, message: "Could not load listings." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function sendError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const itemNameError = validateItemName(body.itemName);
    if (itemNameError) {
      return sendError(itemNameError, 400);
    }
    const itemDescriptionError = validateItemDescription(body.itemDescription);
    if (itemDescriptionError) {
      return sendError(itemDescriptionError, 400);
    }
    const categoryError = validateItemCategory(body.itemCategory);
    if (categoryError) {
      return sendError(categoryError, 400);
    }
    const priceError = validatePrice(body.itemPrice);
    if (priceError) {
      return sendError(priceError, 400);
    }
    const emailError = validateEmail(body.contactEmail);
    if (emailError) {
      return sendError(emailError, 400);
    }
    const contactNameError = validateContactName(body.contactName);
    if (contactNameError) {
      return sendError(contactNameError, 400);
    }
    const stateError = validateState(body.listingState);
    if (stateError) {
      return sendError(stateError, 400);
    }

    await db.insert(listings).values({
      itemName: body.itemName,
      itemDescription: body.itemDescription,
      itemCategory: body.itemCategory,
      itemPrice: body.itemPrice,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      listingState: body.listingState,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (_error) {
    return new Response(JSON.stringify({ ok: false, message: "Could not create listing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
