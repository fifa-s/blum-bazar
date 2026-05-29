"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";

type ListingActionsProps = {
  listingId: number;
};

export function ListingActions({ listingId }: ListingActionsProps) {
  const t = useTranslations();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/inzeraty");
      } else {
        const data = await response.json();
        setDeleteError(data?.error ?? t("common.error.delete"));
      }
    } catch {
      setDeleteError(t("common.error.network"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={t("page.listingDetail.deleteModal.title")} centered>
        <Stack gap="md">
          <Text size="sm">{t("page.listingDetail.deleteModal.message")}</Text>
          {deleteError && (
            <Text c="red" size="sm">
              {deleteError}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={isDeleting}>
              {t("common.cancel")}
            </Button>
            <Button color="red" loading={isDeleting} onClick={handleDelete}>
              {t("common.delete")}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Group gap="xs">
        <Button component={Link} href={`/upravit/${listingId}`}>
          {t("page.listingDetail.editButton")}
        </Button>
        <Button color="red" variant="subtle" px="xs" aria-label={t("common.delete")} onClick={open}>
          <Trash2Icon size={18} />
        </Button>
      </Group>
    </>
  );
}
