"use client";

import { Badge, Button, Card, Group, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { getListingCategoryLabel, getListingStateLabel } from "@/helpers/listing";
import type { ListingCategory, ListingState } from "@/types/listing";

export function ListingCard(props: {
  itemName?: string;
  description?: string;
  category?: ListingCategory;
  price?: number;
  contactName?: string;
  state?: ListingState;
}) {
  const t = useTranslations();

  const categoryLabel = props.category
    ? getListingCategoryLabel(t, props.category)
    : getListingCategoryLabel(t, "other");
  const stateLabel = props.state ? getListingStateLabel(t, props.state) : getListingStateLabel(t, "available");

  const stateColor = props.state === "available" ? "green" : props.state === "reserved" ? "violet" : "black";

  const priceLabel =
    props.price === 0
      ? t("common.listingPrice.free")
      : `${t("common.currency.prefix")}${props.price}${t("common.currency.suffix")}`;

  const priceColor = props.price === 0 ? "green" : "yellow";

  // TODO: Image
  return (
    <Card radius="md" withBorder p="lg">
      <Card.Section px="md" py="xs">
        <Group justify="space-between">
          <Title order={4} flex={1} lineClamp={1}>
            {props.itemName}
          </Title>
          <Badge color={stateColor} variant="light">
            {stateLabel}
          </Badge>
        </Group>
        <Text c="dimmed" truncate>
          {props.description}
        </Text>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Group>
          <Badge color="violet" variant="outline">
            {categoryLabel}
          </Badge>
          <Badge color={priceColor}>{priceLabel}</Badge>
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
