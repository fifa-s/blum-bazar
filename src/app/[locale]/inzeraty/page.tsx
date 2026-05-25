import { Button, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { and, eq, gt, like, or } from "drizzle-orm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/ui/ListingCard";
import { ListingsSearch } from "@/components/ui/ListingsSearch";
import { db } from "@/db";
import { listings } from "@/db/schemas/listings.schema";
import { Link } from "@/i18n/navigation";
import { isListingCategory, isListingState } from "@/types/listing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.listings.title"),
    description: t("page.listings.description"),
  };
}

interface FetchListingsParams {
  query: string;
  category: string;
  state: string;
  price: string;
}

function fetchListings({ query, category, state, price }: FetchListingsParams) {
  const conditions = [];

  // Full-text search across title and description
  if (query) {
    conditions.push(or(like(listings.itemName, `%${query}%`), like(listings.itemDescription, `%${query}%`)));
  }

  if (category && category !== "all") {
    conditions.push(eq(listings.itemCategory, category));
  }

  if (state && state !== "all") {
    conditions.push(eq(listings.listingState, state));
  }

  if (price && price !== "all") {
    if (price === "free") {
      conditions.push(eq(listings.itemPrice, 0));
    } else if (price === "paid") {
      conditions.push(gt(listings.itemPrice, 0));
    }
  }

  const results = db
    .select()
    .from(listings)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(30)
    .all();

  return results;
}

export default async function Page(props: PageProps<"/[locale]/inzeraty">) {
  const t = await getTranslations();

  const searchParams = await props.searchParams;
  const q = (searchParams.q as string) ?? "";
  const category = (searchParams.category as string) ?? "all";
  const state = (searchParams.state as string) ?? "all";
  const price = (searchParams.price as string) ?? "all";

  const listings_to_show = fetchListings({ query: q, category, state, price });

  return (
    <Stack gap="md">
      <Title>{t("page.listings.title")}</Title>
      <Flex justify="space-between" align="flex-end">
        <Text c="dimmed" w="50%">
          {t("page.listings.description")}
        </Text>
        <Link href="/pridat">
          <Button>{t("page.listings.buttonNewListing")}</Button>
        </Link>
      </Flex>
      <ListingsSearch />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {listings_to_show.map((listing) => {
          const category = isListingCategory(listing.itemCategory) ? listing.itemCategory : "other";
          const state = isListingState(listing.listingState) ? listing.listingState : "available";

          return (
            <ListingCard
              key={listing.id}
              id={listing.id}
              itemName={listing.itemName}
              description={listing.itemDescription ?? ""}
              category={category}
              price={listing.itemPrice}
              contactName={listing.contactName}
              state={state}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
