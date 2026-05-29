"use client";

import { Alert, Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { cancelReservation, markListingAsSold, relisting, reserveListing } from "@/actions/listing";
import { getListingCategoryLabel, getListingStateLabel } from "@/helpers/listing";
import { useRouter } from "@/i18n/navigation";
import type { ListingCategory, ListingState } from "@/types/listing";

type ListingDetailCardProps = {
  listingId: number;
  currentUserId?: string; // (undefined = not signed in)
  authorId: string;
  reservedById?: string;
  itemName?: string;
  description?: string;
  category?: ListingCategory;
  price?: number;
  contactName?: string;
  contactEmail?: string;
  state?: ListingState;
};

export function ListingDetailCard(props: ListingDetailCardProps) {
  const t = useTranslations();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const isAuthor = props.currentUserId === props.authorId;
  const isReserver = props.currentUserId === props.reservedById;
  const isAvailable = props.state === "available";
  const isReserved = props.state === "reserved";
  const isSold = props.state === "sold";

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
      router.refresh(); // ← re-fetches server data, updates the badge
    });
  };

  const handleReserve = () => run(() => reserveListing(props.listingId));
  const handleCancelReservation = () => run(() => cancelReservation(props.listingId));
  const handleMarkAsSold = () => run(() => markListingAsSold(props.listingId));
  const handleRelisting = () => run(() => relisting(props.listingId));

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
        <Group gap="xs">
          {/* Available → Reserved (any signed-in user) */}
          {isAvailable && props.currentUserId && (
            <Button variant="light" onClick={handleReserve} loading={isPending}>
              {t("components.listingDetailCard.reserveButton")}
            </Button>
          )}

          {/* Reserved → Available (reserver or author) */}
          {isReserved && (isReserver || isAuthor) && (
            <Button variant="light" color="orange" onClick={handleCancelReservation} loading={isPending}>
              {t("components.listingDetailCard.cancelReservationButton")}
            </Button>
          )}

          {/* Available/Reserved → Sold (author only) */}
          {(isAvailable || isReserved) && isAuthor && (
            <Button variant="outline" color="black" onClick={handleMarkAsSold} loading={isPending}>
              {t("components.listingDetailCard.markAsSold")}
            </Button>
          )}

          {/* Sold → Available (author only) */}
          {isSold && isAuthor && (
            <Button variant="outline" color="orange" onClick={handleRelisting} loading={isPending}>
              {t("components.listingDetailCard.relistButton")}
            </Button>
          )}
        </Group>
      </Card.Section>
    </Card>
  );
}
