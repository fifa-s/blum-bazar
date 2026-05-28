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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = Number(idString);

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
    const keepImage = (formData.get("keepImage") as string) === "true";

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

    const dbImagePath =
      db
        .select({
          imagePath: listings.imagePath,
        })
        .from(listings)
        .where(eq(listings.id, id))
        .get()?.imagePath ?? null;

    let imagePath: string | null = null;
    if (image && !keepImage) {
      if (dbImagePath) imagePath = dbImagePath;
      else imagePath = image ? `${randomUUID()}.webp` : null;
    }

    await db
      .update(listings)
      .set({
        itemName: itemName,
        itemDescription: itemDescription,
        itemCategory: itemCategory,
        itemPrice: itemPrice,
        contactName: contactName,
        contactEmail: contactEmail,
        listingState: listingState,
        ...(image && !keepImage && { imagePath }),
        authorId: authorId,
      })
      .where(eq(listings.id, id));

    if (image && imagePath && !keepImage) await saveImage(image, imagePath);

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
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
