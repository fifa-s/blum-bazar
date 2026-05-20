import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ListingsSearch } from "@/components/ui/ListingsSearch";
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
    </Stack>
  );
}
