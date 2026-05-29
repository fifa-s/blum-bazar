import { Group, Image, SimpleGrid, Stack } from "@mantine/core";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { BackButton } from "@/components/ui/BackButton";
import { ListingActions } from "@/components/ui/ListingActions";
import { ListingDetailCard } from "@/components/ui/ListingDetailCard";
import { db } from "@/db";
import { listings } from "@/db/schemas/listings.schema";
import { isListingCategory, isListingState } from "@/types/listing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("page.listingDetail.title"),
    description: t("page.listingDetail.description"),
  };
}

export default async function Page(props: PageProps<"/[locale]/inzeraty/[id]">) {
  const t = await getTranslations();
  const session = await auth();
  const id = Number((await props.params).id);

  const listing = await db.select().from(listings).where(eq(listings.id, id)).get();

  if (!listing) notFound();

  const category = isListingCategory(listing.itemCategory) ? listing.itemCategory : "other";
  const state = isListingState(listing.listingState) ? listing.listingState : "available";
  const isAuthor = session?.user?.id != null && session.user.id === listing.authorId;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <BackButton href="/inzeraty">{t("page.listingDetail.backToListings")}</BackButton>
        {isAuthor && <ListingActions listingId={id} />}
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Image
          radius="md"
          mah={1000}
          src={listing.imagePath ? `/api/images/${listing.imagePath}` : "/empty-placeholder.png"}
          fallbackSrc="/empty-placeholder.png"
          alt="Image"
        />
        <ListingDetailCard
          listingId={id}
          currentUserId={session?.user?.id}
          authorId={listing.authorId}
          reservedById={listing.reservedById ?? ""}
          itemName={listing.itemName}
          description={listing.itemDescription ?? ""}
          category={category}
          price={listing.itemPrice}
          contactName={listing.contactName}
          contactEmail={listing.contactEmail}
          state={state}
        />
      </SimpleGrid>
    </Stack>
  );
}
