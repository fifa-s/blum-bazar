export const LOCALE_CODE = {
  cs: "cs",
  en: "en",
  de: "de",
  zh: "zh",
  ja: "ja",
} as const;

export type LocaleCode = (typeof LOCALE_CODE)[keyof typeof LOCALE_CODE];

export const LOCALE_CODES: readonly LocaleCode[] = ["cs", "en", "de", "zh", "ja"];
