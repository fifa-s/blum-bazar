export const LOCALE_CODE = {
  cs: "cs",
  en: "en",
  zh: "zh",
} as const;

export type LocaleCode = (typeof LOCALE_CODE)[keyof typeof LOCALE_CODE];

export const LOCALE_CODES: readonly LocaleCode[] = ["cs", "en", "zh"];
