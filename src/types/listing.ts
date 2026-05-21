export const LISTING_CATEGORIES = ["electronics", "furniture", "clothing", "books", "other"] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export const LISTING_STATES = ["available", "reserved", "sold"] as const;

export type ListingState = (typeof LISTING_STATES)[number];

export function isListingCategory(value: string): value is ListingCategory {
  return LISTING_CATEGORIES.includes(value as ListingCategory);
}

export function isListingState(value: string): value is ListingState {
  return LISTING_STATES.includes(value as ListingState);
}
