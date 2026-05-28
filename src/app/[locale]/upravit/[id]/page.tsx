import { Box, Group, Stack, Title } from "@mantine/core";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { BackButton } from "@/components/ui/BackButton";
import { type EditListingProps, ListingForm } from "@/components/ui/ListingForm";
import { db } from "@/db";
import { listings } from "@/db/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.add.title"),
    description: t("page.add.description"),
  };
}

export default async function Page(props: PageProps<"/[locale]/upravit/[id]">) {
  const t = await getTranslations();

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const id = Number((await props.params).id);
  const listing = await db.select().from(listings).where(eq(listings.id, id)).get();

  if (!listing) {
    // TODO: proper error
    console.error("Failed to find listing.");
    redirect("/inzeraty");
  }

  if (listing?.authorId !== session?.user?.id) {
    // TODO: proper error
    console.error("Cannot modify posts you are not an author of.");
    redirect("/inzeraty");
  }

  const editProps: EditListingProps = {
    initVals: {
      itemName: listing.itemName,
      itemDescription: listing.itemDescription ?? "",
      itemCategory: listing.itemCategory,
      itemPrice: listing.itemPrice,
      contact: {
        name: listing.contactName,
        email: listing.contactEmail,
      },
      listingState: listing.listingState,
    },
    image: listing.imagePath,
    id: listing.id,
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title>{t("page.add.title")}</Title>
        <BackButton href="/inzeraty">{t("page.add.backToListings")}</BackButton>
      </Group>
      <Box w="100%" maw={600} pb="xl">
        <ListingForm user={session.user} editProps={editProps} />
      </Box>
    </Stack>
  );
}
