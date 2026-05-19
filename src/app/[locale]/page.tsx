import { Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  return (
    <>
      <Title>{t("page.home.title")}</Title>
      <Text w="50%" c="dimmed">
        {t("page.home.description")}
      </Text>
      <Link href="/inzeraty" style={{ color: "blue" }}>
        Inzeráty
      </Link>
    </>
  );
}
