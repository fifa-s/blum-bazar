import { Button, Flex, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ListingsSearch } from "@/components/ui/ListingsSearch";

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
    <>
      <Title>{t("page.listings.title")}</Title>
      <Flex justify="space-between" align="flex-end">
        <Text c="dimmed" w="50%">
          {t("page.listings.description")}
        </Text>
        <Button>+ Přidat nabídku</Button>
      </Flex>
      <ListingsSearch />
    </>
  );
}
