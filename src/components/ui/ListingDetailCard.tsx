"use client";

import { Alert, Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { getListingCategoryLabel, getListingStateLabel } from "@/helpers/listing";
import type { ListingCategory, ListingState } from "@/types/listing";

export function ListingDetailCard(props: {
  itemName?: string;
  description?: string;
  category?: ListingCategory;
  price?: number;
  contactName?: string;
  contactEmail?: string;
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

  return (
    <Card radius="md" withBorder p="lg">
      <Card.Section px="md" py="xs" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4} flex={1} lineClamp={1}>
              {props.itemName}
            </Title>
            <Badge color={stateColor} variant="light">
              {stateLabel}
            </Badge>
          </Group>
          <Group>
            <Badge color="violet" variant="outline">
              {categoryLabel}
            </Badge>
            <Badge color={priceColor}>{priceLabel}</Badge>
          </Group>
          <Text>{props.description}</Text>
        </Stack>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Stack gap="xs">
          <Title order={5}>{t("components.listingDetailCard.contactTitle")}</Title>
          <Stack gap="0">
            <Text size="md" truncate>
              {props.contactName}
            </Text>
            <Text size="sm" truncate c="dimmed">
              {props.contactEmail}
            </Text>
          </Stack>
          <Alert
            color="violet"
            variant="light"
            title={t("components.listingDetailCard.contactDisclaimerTitle")}
            icon={<AlertCircle size={16} />}
            mt="md"
          >
            {t("components.listingDetailCard.contactDisclaimer")}
          </Alert>
        </Stack>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Group grow>
          <Button variant="light">{t("components.listingCard.detailButton")}</Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
