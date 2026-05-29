"use client";

import { Button, Checkbox, Group, NumberInput, Paper, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getListingCategoryOptions, getListingStateOptions } from "@/helpers/listing";
import "@/helpers/validators";
import type { FileWithPath } from "@mantine/dropzone";
import type { User } from "next-auth";
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
import { Link, useRouter } from "@/i18n/navigation";

export type ListingInitVals = {
  itemName: string;
  itemDescription: string;
  itemCategory: string;
  itemPrice: number;
  contact: {
    name: string;
    email: string;
  };
  listingState: string;
};

export type EditListingProps = {
  initVals: ListingInitVals;
  image?: string | null;
  id: number;
};

export function ListingForm(props: { user: User; editProps?: EditListingProps }) {
  const t = useTranslations();

  const [isFree, setIsFree] = useState(props.editProps?.initVals.itemPrice === 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState(0);
  const [defaultImageCleared, setDefaultImageCleared] = useState(false);

  const [imageFile, setImageFile] = useState<FileWithPath | null>(null);

  const isEditing = props.editProps !== undefined;

  const initVals = props.editProps
    ? props.editProps.initVals
    : {
        itemName: "",
        itemDescription: "",
        itemCategory: "",
        itemPrice: 0,
        contact: {
          name: props.user.name ?? "",
          email: props.user.email ?? "",
        },
        listingState: "available",
      };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: initVals,

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
    formData.append("authorId", props.user.id as string);
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    } else if (isEditing && !defaultImageCleared) {
      formData.append("keepImage", "true");
    }

    const url = isEditing ? `/api/listings/${props.editProps?.id}` : "/api/listings";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data?.error || "Unable to save listing.");
        return;
      }

      if (!isEditing) form.reset();
      router.push(`/inzeraty/${data.id}`);
    } catch (_error) {
      setServerError("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imagePath = props.editProps?.image ? `/api/images/${props.editProps?.image}` : null;

  const isFormValid = form.isValid();

  return (
    <Paper radius="md" withBorder p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            withAsterisk
            label={t("components.listingForm.item.name")}
            placeholder={t("components.listingForm.item.placeholder")}
            key={form.key("itemName")}
            {...form.getInputProps("itemName")}
          />
          <Textarea
            label={t("components.listingForm.itemDescription.name")}
            placeholder={t("components.listingForm.itemDescription.placeholder")}
            autosize
            minRows={3}
            key={form.key("itemDescription")}
            {...form.getInputProps("itemDescription")}
          />
          <Select
            withAsterisk
            label={t("components.listingForm.itemCategory.name")}
            placeholder={t("components.listingForm.itemCategory.placeholder")}
            data={getListingCategoryOptions(t)}
            key={form.key("itemCategory")}
            {...form.getInputProps("itemCategory")}
          />
          <Group grow align="flex-end">
            <NumberInput
              label={t("components.listingForm.itemPrice.name")}
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
              label={t("components.listingForm.itemPrice.free")}
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
              label={t("components.listingForm.contactName.name")}
              placeholder={t("components.listingForm.contactName.placeholder")}
              key={form.key("contact.name")}
              {...form.getInputProps("contact.name")}
            />
            <TextInput
              withAsterisk
              label={t("components.listingForm.contactEmail.name")}
              placeholder={t("components.listingForm.contactEmail.placeholder")}
              key={form.key("contact.email")}
              {...form.getInputProps("contact.email")}
            />
          </Group>
          <Select
            label={t("components.listingForm.listingState.name")}
            placeholder={t("common.listingState.available")}
            data={getListingStateOptions(t)}
            key={form.key("listingState")}
            {...form.getInputProps("listingState")}
          />
          <ImageDropZone
            file={imageFile}
            onFileChange={setImageFile}
            defaultImage={imagePath}
            onDefaultImageClear={() => setDefaultImageCleared(true)}
          />{" "}
          <Text size="xs" c="dimmed">
            {t("components.listingForm.paymentInfo")}
          </Text>
          <Group justify="flex-end">
            {isEditing && (
              <Button component={Link} href="/inzeraty" variant="light" color="gray">
                {t("components.listingForm.cancelButton")}
              </Button>
            )}
            <Button type="submit" loading={isSubmitting} disabled={!isFormValid || isSubmitting}>
              {isEditing ? t("components.listingForm.editButton") : t("components.listingForm.addButton")}
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
