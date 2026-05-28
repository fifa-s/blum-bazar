import { Box, Group, Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { BackButton } from "@/components/ui/BackButton";
import { ListingForm } from "@/components/ui/ListingForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.add.title"),
    description: t("page.add.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const t = await getTranslations();

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title>{t("page.add.title")}</Title>
        <BackButton href="/inzeraty">{t("page.add.backToListings")}</BackButton>
      </Group>
      <Box w="100%" maw={600} pb="xl">
        <ListingForm user={session.user} />
      </Box>
    </Stack>
  );
}
