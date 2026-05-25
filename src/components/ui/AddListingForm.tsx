"use client";

import { Button, Checkbox, Group, NumberInput, Paper, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getListingCategoryOptions, getListingStateOptions } from "@/helpers/listing";
import "@/helpers/validators";
import type { FileWithPath } from "@mantine/dropzone";
import { ImageDropZone } from "@/components/ui/ImageDropZone";
import {
  validateContactName,
  validateEmail,
  validateItemCategory,
  validateItemDescription,
  validateItemName,
  validatePrice,
  validateState,
} from "@/helpers/validators";
import { useRouter } from "@/i18n/navigation";

export function AddListingForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [lastPrice, setLastPrice] = useState(0);
  const [imageFile, setImageFile] = useState<FileWithPath | null>(null);

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
      itemName: validateItemName,
      itemDescription: validateItemDescription,
      itemCategory: validateItemCategory,
      itemPrice: validatePrice,
      contact: {
        email: validateEmail,
        name: validateContactName,
      },
      listingState: validateState,
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("itemName", values.itemName.trim());
    formData.append("itemDescription", values.itemDescription?.trim() ?? "");
    formData.append("itemCategory", values.itemCategory.trim());
    formData.append("itemPrice", String(values.itemPrice));
    formData.append("contactName", values.contact.name.trim());
    formData.append("contactEmail", values.contact.email.trim());
    formData.append("listingState", values.listingState);
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data?.error || "Unable to save listing.");
        return;
      }

      form.reset();
      router.push(`/inzeraty/${data.id}`);
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
            data={getListingCategoryOptions(t)}
            key={form.key("itemCategory")}
            {...form.getInputProps("itemCategory")}
          />
          <Group grow align="flex-end">
            <NumberInput
              label={t("page.add.itemPrice.name")}
              min={0}
              step={1}
              prefix={t("common.currency.prefix")}
              suffix={t("common.currency.suffix")}
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
              withAsterisk
              label={t("page.add.contactName.name")}
              placeholder={t("page.add.contactName.placeholder")}
              key={form.key("contact.name")}
              {...form.getInputProps("contact.name")}
            />
            <TextInput
              withAsterisk
              label={t("page.add.contactEmail.name")}
              placeholder={t("page.add.contactEmail.placeholder")}
              key={form.key("contact.email")}
              {...form.getInputProps("contact.email")}
            />
          </Group>
          <Select
            label={t("page.add.listingState.name")}
            placeholder={t("common.listingState.available")}
            data={getListingStateOptions(t)}
            key={form.key("listingState")}
            {...form.getInputProps("listingState")}
          />
          <ImageDropZone file={imageFile} onFileChange={setImageFile} />
          <Text size="xs" c="dimmed">
            {t("page.add.paymentInfo")}
          </Text>
          <Group justify="flex-end">
            <Button type="submit" loading={isSubmitting}>
              {t("page.add.button")}
            </Button>
          </Group>
          {serverError ? (
            <Text c="red" size="sm">
              {serverError}
            </Text>
          ) : null}
        </Stack>
      </form>
    </Paper>
  );
}
