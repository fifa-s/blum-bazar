import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, users } from "@/db/schemas";
import { sendError } from "@/helpers/apiError";
import { saveImage } from "@/helpers/image";
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
  imagePath: string | null;
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
        imagePath: listings.imagePath,
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
      imagePath: l.imagePath,
    }));

    return Response.json(response);
  } catch (_error) {
    return new Response(JSON.stringify({ ok: false, message: "Could not load listings." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export function log<T extends Record<string, unknown>>(obj: T): void {
  const key = Object.keys(obj)[0];
  console.log("LOG", `${key}:`, obj[key]);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const itemName = formData.get("itemName") as string;
    const itemDescription = formData.get("itemDescription") as string;
    const itemCategory = formData.get("itemCategory") as string;
    const itemPriceString = formData.get("itemPrice") as string;
    const contactName = formData.get("contactName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const listingState = formData.get("listingState") as string;
    const image = formData.get("image") as File | null;
    const authorId = formData.get("authorId") as string;

    if (authorId == null || authorId === "undefined") {
      return sendError("authorId is required", 400);
    }

    const result = await db.select({ id: users.id }).from(users).where(eq(users.id, authorId)).limit(1);

    if (result.length <= 0) {
      return sendError("Invalid AuthorId", 400);
    }

    const itemPrice = Number(itemPriceString);
    if (Number.isNaN(itemPrice)) {
      return sendError("Price must be a valid number.", 400);
    }

    const itemNameError = validateItemName(itemName);
    if (itemNameError) {
      return sendError(itemNameError, 400);
    }
    const itemDescriptionError = validateItemDescription(itemDescription);
    if (itemDescriptionError) {
      return sendError(itemDescriptionError, 400);
    }
    const categoryError = validateItemCategory(itemCategory);
    if (categoryError) {
      return sendError(categoryError, 400);
    }
    const priceError = validatePrice(itemPrice);
    if (priceError) {
      return sendError(priceError, 400);
    }
    const emailError = validateEmail(contactEmail);
    if (emailError) {
      return sendError(emailError, 400);
    }
    const contactNameError = validateContactName(contactName);
    if (contactNameError) {
      return sendError(contactNameError, 400);
    }
    const stateError = validateState(listingState);
    if (stateError) {
      return sendError(stateError, 400);
    }

    const imagePath: string | null = image ? `${randomUUID()}.webp` : null;

    const [row] = await db
      .insert(listings)
      .values({
        itemName: itemName,
        itemDescription: itemDescription,
        itemCategory: itemCategory,
        itemPrice: itemPrice,
        contactName: contactName,
        contactEmail: contactEmail,
        listingState: listingState,
        imagePath: imagePath,
        authorId: authorId,
      })
      .returning({ id: listings.id });

    if (image && imagePath) {
      try {
        await saveImage(image, imagePath);
      } catch {
        return sendError("Image could not be processed. Please upload a JPEG, PNG, or WebP file.", 400);
      }
    }

    return new Response(JSON.stringify({ ok: true, id: row.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, message: "Could not create listing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
