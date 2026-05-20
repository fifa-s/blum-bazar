"use client";

import { Flex, Paper, SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export function ListingsSearch() {
  const t = useTranslations();

  return (
    <Paper radius="md" withBorder p="md">
      <Stack gap="md">
        <Flex gap="md">
          <TextInput
            placeholder={t("components.listingsSearch.placeholder")}
            leftSection={<Search size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            style={{ flex: 1 }}
            placeholder={t("components.listingsSearch.categoryPlaceholder")}
            data={[
              { value: "all", label: t("common.category.all") },
              { value: "electronics", label: t("common.category.electronics") },
              { value: "furniture", label: t("common.category.furniture") },
              { value: "clothing", label: t("common.category.clothing") },
              { value: "books", label: t("common.category.books") },
              { value: "other", label: t("common.category.other") },
            ]}
          />
          <Select
            style={{ flex: 1 }}
            placeholder={t("components.listingsSearch.statePlaceholder")}
            data={[
              { value: "all", label: t("common.listingState.all") },
              { value: "available", label: t("common.listingState.available") },
              { value: "reserved", label: t("common.listingState.reserved") },
              { value: "sold", label: t("common.listingState.sold") },
            ]}
          />
        </Flex>
        <Flex>
          <SegmentedControl
            style={{ flex: 1 }}
            data={[
              { value: "all", label: t("common.listingPrice.all") },
              { value: "free", label: t("common.listingPrice.free") },
              { value: "paid", label: t("common.listingPrice.paid") },
            ]}
          />
        </Flex>
      </Stack>
    </Paper>
  );
}
