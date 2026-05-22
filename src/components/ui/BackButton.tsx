"use client";

import type { UrlObject } from "node:url";
import { Group, Text } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function BackButton(props: { children?: React.ReactNode; href: string | UrlObject }) {
  return (
    <Link href={props.href}>
      <Group c="red" gap="xs" align="center">
        <ArrowLeft size={16} />
        <Text>{props.children}</Text>
      </Group>
    </Link>
  );
}
