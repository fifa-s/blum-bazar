import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ListingCard } from "@/components/ui/ListingCard";
import { ListingsSearch } from "@/components/ui/ListingsSearch";
import { db } from "@/db";
import { listings } from "@/db/schemas/listings.schema";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.listings.title"),
    description: t("page.listings.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  const listings_to_show = db.select().from(listings).all();

  return (
    <Stack gap="md">
      <Title>{t("page.listings.title")}</Title>
      <Flex justify="space-between" align="flex-end">
        <Text c="dimmed" w="50%">
          {t("page.listings.description")}
        </Text>
        <Link href="/pridat">
          <Button>+ Přidat nabídku</Button>
        </Link>
      </Flex>
      <ListingsSearch />
      {listings_to_show.map((listing) => (
        <ListingCard
          key={listing.id}
          itemName={listing.itemName}
          description={listing.itemDescription ?? ""}
          category={listing.itemCategory}
          price={listing.itemPrice}
          contactName={listing.contactName}
          state={listing.listingState}
        />
      ))}
    </Stack>
  );
}
