"use client";

import { Flex, Paper, SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export function ListingsSearch() {
  const t = useTranslations();

  return (
    <Paper radius="md" withBorder p="sm">
      <Stack gap="sm">
        <Flex gap="sm">
          <TextInput
            placeholder={t("components.listingsSearch.placeholder")}
            leftSection={<Search size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            style={{ flex: 1 }}
            placeholder={t("components.listingsSearch.categoryPlaceholder")}
            data={[
              { value: "all", label: t("components.listingsSearch.category.all") },
              { value: "electronics", label: t("components.listingsSearch.category.electronics") },
              { value: "furniture", label: t("components.listingsSearch.category.furniture") },
              { value: "clothing", label: t("components.listingsSearch.category.clothing") },
              { value: "books", label: t("components.listingsSearch.category.books") },
              { value: "other", label: t("components.listingsSearch.category.other") },
            ]}
          />
          <Select
            style={{ flex: 1 }}
            placeholder={t("components.listingsSearch.statePlaceholder")}
            data={[
              { value: "all", label: t("components.listingsSearch.state.all") },
              { value: "available", label: t("components.listingsSearch.state.available") },
              { value: "reserved", label: t("components.listingsSearch.state.reserved") },
              { value: "sold", label: t("components.listingsSearch.state.sold") },
            ]}
          />
        </Flex>
        <Flex>
          <SegmentedControl
            style={{ flex: 1 }}
            data={[
              { label: "Vše", value: "all" },
              { label: "Zdarma", value: "free" },
              { label: "Placené", value: "paid" },
            ]}
          />
        </Flex>
      </Stack>
    </Paper>
  );
}
