import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AddListingForm } from "@/components/ui/AddListingForm";
import { Link } from "@/i18n/navigation";

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
    <Stack gap="md">
      <Group justify="space-between">
        <Title>{t("page.add.title")}</Title>
        <Link href="/inzeraty">
          <Group c="red" gap="xs" align="center">
            <ArrowLeft size={16} />
            <Text>{t("page.add.backToListings")}</Text>
          </Group>
        </Link>
      </Group>
      <Box w="100%" maw={600} pb="xl">
        <AddListingForm />
      </Box>
    </Stack>
  );
}
