import type { useTranslations } from "next-intl";
import type { ListingCategory, ListingState } from "@/types/listing";
import { LISTING_CATEGORIES, LISTING_STATES } from "@/types/listing";

type TranslateFn = ReturnType<typeof useTranslations>;
type TranslateKey = Parameters<TranslateFn>[0];

type ListingOption<Value extends string> = {
  value: Value;
  label: string;
};

type PriceValue = "all" | "free" | "paid";

export function getListingCategoryLabel(t: TranslateFn, category: ListingCategory) {
  return t(`common.category.${category}` as TranslateKey);
}

export function getListingStateLabel(t: TranslateFn, state: ListingState) {
  return t(`common.listingState.${state}` as TranslateKey);
}

export function getListingCategoryOptions(t: TranslateFn): ListingOption<ListingCategory>[] {
  return LISTING_CATEGORIES.map((category) => ({
    value: category,
    label: getListingCategoryLabel(t, category),
  }));
}

export function getListingStateOptions(t: TranslateFn): ListingOption<ListingState>[] {
  return LISTING_STATES.map((state) => ({
    value: state,
    label: getListingStateLabel(t, state),
  }));
}

export function getListingCategorySelectOptions(
  t: TranslateFn,
): Array<ListingOption<ListingCategory> | ListingOption<"all">> {
  return [{ value: "all", label: t("common.category.all" as TranslateKey) }, ...getListingCategoryOptions(t)];
}

export function getListingStateSelectOptions(
  t: TranslateFn,
): Array<ListingOption<ListingState> | ListingOption<"all">> {
  return [{ value: "all", label: t("common.listingState.all" as TranslateKey) }, ...getListingStateOptions(t)];
}

export function getListingPriceOptions(t: TranslateFn): ListingOption<PriceValue>[] {
  return [
    { value: "all", label: t("common.listingPrice.all" as TranslateKey) },
    { value: "free", label: t("common.listingPrice.free" as TranslateKey) },
    { value: "paid", label: t("common.listingPrice.paid" as TranslateKey) },
  ];
}

export function getListingPriceLabel(t: TranslateFn, price: number) {
  return price === 0
    ? t("common.listingPrice.free" as TranslateKey)
    : `${t("common.currency.prefix" as TranslateKey)}${price}${t("common.currency.suffix" as TranslateKey)}`;
}
