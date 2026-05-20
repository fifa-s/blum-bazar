"use client";

import { Button, Checkbox, Group, NumberInput, Paper, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";

export function AddListingForm() {
  const t = useTranslations();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      itemName: "",
      itemDescription: "",
      itemCategory: "",
      itemPrice: 0,
      contact: {
        name: "",
        email: "",
      },
    },

    validate: {
      itemName: (value) => (value ? null : "Item name is required"),
      itemCategory: (value) => (value ? null : "Category is required"),
      contact: {
        email: (value) => {
          if (!value) return null; // Email is optional
          const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(value) ? null : "Invalid email";
        },
      },
    },
  });

  return (
    <Paper radius="md" withBorder p="md">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack gap="md">
          <TextInput
            withAsterisk
            label={t("page.add.item.name")}
            placeholder={t("page.add.item.placeholder")}
            key={form.key("itemName")}
            {...form.getInputProps("itemName")}
          />
          <Textarea
            label={t("page.add.itemDescription.name")}
            placeholder={t("page.add.itemDescription.placeholder")}
            autosize
            minRows={3}
            key={form.key("itemDescription")}
            {...form.getInputProps("itemDescription")}
          />
          <Select
            withAsterisk
            label={t("page.add.itemCategory.name")}
            placeholder={t("page.add.itemCategory.placeholder")}
            data={[
              { value: "electronics", label: t("common.category.electronics") },
              { value: "furniture", label: t("common.category.furniture") },
              { value: "clothing", label: t("common.category.clothing") },
              { value: "books", label: t("common.category.books") },
              { value: "other", label: t("common.category.other") },
            ]}
            key={form.key("itemCategory")}
            {...form.getInputProps("itemCategory")}
          />
          <Group grow align="flex-end">
            <NumberInput
              label={t("page.add.itemPrice.name")}
              min={0}
              step={1}
              suffix={t("page.add.itemPrice.suffix")}
              key={form.key("itemPrice")}
              {...form.getInputProps("itemPrice")}
            />
            <Checkbox label={t("page.add.itemPrice.free")} />
          </Group>
          <Group grow>
            <TextInput
              label={t("page.add.contactName.name")}
              placeholder={t("page.add.contactName.placeholder")}
              key={form.key("contact.name")}
              {...form.getInputProps("contact.name")}
            />
            <TextInput
              label={t("page.add.contactEmail.name")}
              placeholder={t("page.add.contactEmail.placeholder")}
              key={form.key("contact.email")}
              {...form.getInputProps("contact.email")}
            />
          </Group>
          <Select
            label={t("page.add.listingState.name")}
            placeholder={t("common.listingState.available")}
            data={[
              { value: "available", label: t("common.listingState.available") },
              { value: "reserved", label: t("common.listingState.reserved") },
              { value: "sold", label: t("common.listingState.sold") },
            ]}
            key={form.key("listingState")}
            {...form.getInputProps("listingState")}
          />
          <Text size="xs" c="dimmed">
            {t("page.add.paymentInfo")}
          </Text>
          <Group justify="flex-end">
            <Button type="submit">{t("page.add.button")}</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
