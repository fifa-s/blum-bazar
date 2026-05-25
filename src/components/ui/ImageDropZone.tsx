import { Group, Image, Stack, Text } from "@mantine/core";
import { Dropzone, type FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type ImageDropZoneProps = {
  file?: FileWithPath | null;
  onFileChange?: (file: FileWithPath | null) => void;
};

export function ImageDropZone(props: ImageDropZoneProps) {
  const t = useTranslations();

  //const [file, setFile] = useState<FileWithPath | null>(null);

  const preview = (f: FileWithPath | null) => {
    if (!f) return null;
    const imageUrl = URL.createObjectURL(f);
    return <Image key={0} src={imageUrl} h={200} w="auto" fit="contain" onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  };

  return (
    <Stack gap="md" align="center">
      <Dropzone
        onDrop={(files) => props.onFileChange?.(files[0] ?? null)}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        maxFiles={1}
        accept={IMAGE_MIME_TYPE}
      >
        <Group justify="center" gap="xl" mih={180} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <UploadIcon size={52} color="var(--mantine-color-blue-6)" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XIcon size={52} color="var(--mantine-color-red-6)" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <ImageIcon size={52} color="var(--mantine-color-dimmed)" />
          </Dropzone.Idle>

          <Stack align="center" gap="sm">
            {preview(props.file ?? null)}
            <Text size="lg" inline>
              {t("components.imageDropZone.title")}
            </Text>
            <Text size="sm" c="dimmed" inline>
              {t("components.imageDropZone.description")}
            </Text>
          </Stack>
        </Group>
      </Dropzone>
    </Stack>
  );
}
