import { Button, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
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

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  const listings_to_show = db.select().from(listings).limit(30).all();

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
