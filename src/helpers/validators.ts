export function validateEmail(email: string): string | null {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) ? null : "Invalid email";
}

export function validatePrice(price: number): string | null {
  return price >= 0 ? null : "Price must be a positive number";
}

export function validateCategory(category: string): string | null {
  const validCategories = ["electronics", "furniture", "clothing", "books", "other"];
  return validCategories.includes(category) ? null : "Invalid category";
}

export function validateState(state: string): string | null {
  const validStates = ["available", "reserved", "sold"];
  return validStates.includes(state) ? null : "Invalid listing state";
}
