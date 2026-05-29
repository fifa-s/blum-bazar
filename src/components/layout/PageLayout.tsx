"use client";

import { AppShell, Container } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/layout/AppHeader";

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 900;

export function PageLayout({ children }: PropsWithChildren) {
  const t = useTranslations();

  return (
    <AppShell header={{ height: HEADER_HEIGHT }} padding="md" withBorder={false}>
      <AppShell.Header px="md">
        <Container size={BODY_MAX_WIDTH} h="100%">
          <AppHeader
            navLinks={[
              { label: t("components.header.listings"), href: "/inzeraty" },
              { label: t("components.header.newListing"), href: "/pridat" },
            ]}
          />
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size={BODY_MAX_WIDTH} px="md">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
