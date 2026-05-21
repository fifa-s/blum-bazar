"use client";

import { Badge, Button, Card, Group, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export function ListingCard(props: {
  itemName?: string;
  description?: string;
  category?: string;
  price?: number;
  contactName?: string;
  state?: string;
}) {
  const t = useTranslations();

  // TODO: Image
  return (
    <Card radius="md" withBorder p="lg">
      <Card.Section px="md" py="xs">
        <Group justify="space-between">
          <Title order={3}>{props.itemName}</Title>
          <Badge color="green">{props.state}</Badge>
        </Group>
        <Text c="dimmed" truncate>
          {props.description}
        </Text>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Group>
          <Badge color="blue">{props.category}</Badge>
          <Badge color="yellow">
            {t("common.currency.prefix")}
            {props.price}
            {t("common.currency.suffix")}
          </Badge>
        </Group>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Text c="dimmed" size="sm">
          {t("components.listingCard.contactInfo")}
          {props.contactName}
        </Text>
      </Card.Section>
      <Card.Section px="md" py="xs" mt="auto">
        <Group grow>
          <Button variant="light">{t("components.listingCard.detailButton")}</Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
