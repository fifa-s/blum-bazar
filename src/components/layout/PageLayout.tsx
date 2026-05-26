"use client";

import { AppShell, Container } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/layout/AppHeader";

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 900;

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <AppShell header={{ height: HEADER_HEIGHT }} padding="md" withBorder={false}>
      <AppShell.Header px="md">
        <Container size={BODY_MAX_WIDTH} h="100%">
          <AppHeader
            navLinks={[
              { label: "Inzeráty", href: "/inzeraty" },
              { label: "Nový inzerát", href: "/pridat" },
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
