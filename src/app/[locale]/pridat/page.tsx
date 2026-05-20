import { Box, Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AddListingForm } from "@/components/ui/AddListingForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.add.title"),
    description: t("page.add.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  return (
    <Box w="100%" maw={600} pb="xl">
      <Stack gap="md">
        <Title>{t("page.add.title")}</Title>
        <AddListingForm />
      </Stack>
    </Box>
  );
}
