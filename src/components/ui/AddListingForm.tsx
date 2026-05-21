"use client";

import { Button, Checkbox, Group, NumberInput, Paper, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { validateEmail } from "@/helpers/validators";

export function AddListingForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [lastPrice, setLastPrice] = useState(0);

  const form = useForm({
    initialValues: {
      itemName: "",
      itemDescription: "",
      itemCategory: "",
      itemPrice: 0,
      contact: {
        name: "",
        email: "",
      },
      listingState: "available",
    },

    validate: {
      itemName: (value) => (value ? null : "Item name is required"),
      itemCategory: (value) => (value ? null : "Category is required"),
      contact: {
        email: validateEmail,
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      itemName: values.itemName.trim(),
      itemDescription: values.itemDescription?.trim() || null,
      itemCategory: values.itemCategory.trim(),
      itemPrice: values.itemPrice,
      contactName: values.contact.name.trim() || null,
      contactEmail: values.contact.email.trim() || null,
      listingState: values.listingState,
    };

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data?.error || "Unable to save listing.");
        return;
      }

      form.reset();
      window.alert(t("page.add.successMessage") ?? "Listing created successfully.");
    } catch (_error) {
      setServerError("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper radius="md" withBorder p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {serverError ? (
            <Text c="red" size="sm">
              {serverError}
            </Text>
          ) : null}
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
              disabled={isFree}
              {...(isFree ? null : { withAsterisk: true })}
            />
            <Checkbox
              label={t("page.add.itemPrice.free")}
              onChange={(event) => {
                const free = event.currentTarget.checked;
                setIsFree(free);
                if (free) {
                  setLastPrice(form.values.itemPrice);
                  form.setFieldValue("itemPrice", 0);
                } else {
                  form.setFieldValue("itemPrice", lastPrice);
                }
              }}
            />
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
            <Button type="submit" loading={isSubmitting}>
              {t("page.add.button")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
