export function validateItemName(name: string): string | null {
  const val = name.trim();
  if (val === null || val === "") {
    return "Item name is required";
  }
  if (val.length > 60) {
    return "Item name must be at most 60 characters";
  }
  return null;
}

export function validateItemDescription(description: string): string | null {
  const val = description.trim();
  if (val.length > 500) {
    return "Description must be at most 500 characters";
  }
  return null;
}

export function validateItemCategory(category: string): string | null {
  const validCategories = ["electronics", "furniture", "clothing", "books", "other"];
  return validCategories.includes(category) ? null : "Invalid category";
}

export function validatePrice(price: number): string | null {
  if (price < 0) {
    return "Price must be a positive number";
  }
  if (price > 1000000) {
    return "Price must be less than 1000000";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) ? null : "Invalid email";
}

export function validateContactName(name: string): string | null {
  const val = name.trim();
  if (val === null || val === "") {
    return "Contact name is required";
  }
  if (val.length > 60) {
    return "Contact name must be at most 60 characters";
  }
  return null;
}

export function validateState(state: string): string | null {
  const validStates = ["available", "reserved", "sold"];
  return validStates.includes(state) ? null : "Invalid listing state";
}
