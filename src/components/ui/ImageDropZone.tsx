import { ActionIcon, Group, Image, Overlay, Stack, Text } from "@mantine/core";
import { Dropzone, type FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type ImageDropZoneProps = {
  file?: FileWithPath | null;
  defaultImage?: string | null;
  onFileChange?: (file: FileWithPath | null) => void;
};

export function ImageDropZone(props: ImageDropZoneProps) {
  const t = useTranslations();

  const previewSrc = props.file ? URL.createObjectURL(props.file) : (props.defaultImage ?? null);

  const hasPreview = previewSrc !== null;

  return (
    <Stack gap="md" align="center">
      <Dropzone
        onDrop={(files) => props.onFileChange?.(files[0] ?? null)}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
        style={{ position: "relative" }}
      >
        <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: "none" }}>
          {hasPreview ? (
            <Image
              src={previewSrc}
              h={180}
              w="auto"
              fit="contain"
              radius="md"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
                borderRadius: "var(--mantine-radius-md)",
              }}
              onLoad={() => {
                if (props.file) URL.revokeObjectURL(previewSrc);
              }}
            />
          ) : (
            <>
              <Dropzone.Accept>
                <UploadIcon size={52} color="var(--mantine-color-blue-6)" />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <XIcon size={52} color="var(--mantine-color-red-6)" />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <ImageIcon size={52} color="var(--mantine-color-dimmed)" />
              </Dropzone.Idle>
              <Stack align="center" gap="xs">
                <Text size="lg" inline fw={500}>
                  {t("components.imageDropZone.title")}
                </Text>
                <Text size="sm" c="dimmed" inline>
                  {t("components.imageDropZone.description")}
                </Text>
              </Stack>
            </>
          )}
        </Group>

        {hasPreview && (
          <Overlay backgroundOpacity={0} style={{ pointerEvents: "none" }}>
            <ActionIcon
              variant="filled"
              color="dark"
              radius="xl"
              size="sm"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                pointerEvents: "all",
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation();
                props.onFileChange?.(null);
              }}
            >
              <XIcon size={12} />
            </ActionIcon>
          </Overlay>
        )}
      </Dropzone>
    </Stack>
  );
}
