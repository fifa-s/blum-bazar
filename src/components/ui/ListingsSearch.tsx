"use client";

import { Group, Paper, SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  getListingCategorySelectOptions,
  getListingPriceOptions,
  getListingStateSelectOptions,
} from "@/helpers/listing";
import { usePathname, useRouter } from "@/i18n/navigation";

export interface ListingsSearchState {
  search: string;
  category: string;
  state: string;
  price: string;
}

export function ListingsSearch() {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && (value !== "all" || key === "q")) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useDebouncedCallback((value: string) => updateParams("q", value), 300);

  return (
    <Paper radius="md" withBorder p="md">
      <Stack gap="md">
        <Group grow gap="md">
          <TextInput
            placeholder={t("components.listingsSearch.placeholder")}
            leftSection={<Search size={16} />}
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            placeholder={t("components.listingsSearch.categoryPlaceholder")}
            data={getListingCategorySelectOptions(t)}
            defaultValue={searchParams.get("category") ?? ""}
            onChange={(value) => updateParams("category", value ?? "all")}
          />
          <Select
            placeholder={t("components.listingsSearch.statePlaceholder")}
            data={getListingStateSelectOptions(t)}
            defaultValue={searchParams.get("state") ?? ""}
            onChange={(value) => updateParams("state", value ?? "all")}
          />
        </Group>
        <SegmentedControl
          fullWidth
          data={getListingPriceOptions(t)}
          defaultValue={searchParams.get("price") ?? ""}
          onChange={(value) => updateParams("price", value ?? "all")}
        />
      </Stack>
    </Paper>
  );
}
