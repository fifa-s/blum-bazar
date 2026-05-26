"use client";

import {
  Alert,
  Anchor,
  Box,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { validateEmail } from "@/helpers/validators";

interface AuthCardProps {
  mode: "login" | "register";
  title: string;
  subtitle: string;
  googleButtonLabel: string;
  dividerLabel: string;
  submitButtonLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  forgotPasswordLabel?: string;
  forgotPasswordHref?: string;
  redirectTo?: string;
}

export function AuthCard({
  mode,
  title,
  subtitle,
  googleButtonLabel,
  dividerLabel,
  submitButtonLabel,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  nameLabel = "Name",
  namePlaceholder = "Your name",
  emailLabel = "Email",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Your password",
  forgotPasswordLabel,
  forgotPasswordHref = "/forgot-password",
  redirectTo = "/dashboard",
}: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? redirectTo;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    initialValues: { name: "", email: "", password: "" },
    validate: {
      email: validateEmail,
      password: (v) =>
        mode === "register" && v.length < 8
          ? "Password must be at least 8 characters"
          : v.length === 0
            ? "Password is required"
            : null,
    },
  });

  async function handleSubmit(values: typeof form.values) {
    setLoading(true);
    setError("");

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (mode === "register") {
        router.push("/login");
      } else {
        setError("Invalid email or password.");
      }
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { redirectTo: callbackUrl });
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--mantine-spacing-md)",
      }}
    >
      <Paper
        shadow="xs"
        radius="lg"
        p="xl"
        withBorder
        style={{ width: "100%", maxWidth: 420, borderColor: "var(--mantine-color-gray-2)" }}
      >
        <Stack gap="xs" mb="xl">
          <Title order={2} fw={600} style={{ letterSpacing: "-0.02em" }}>
            {title}
          </Title>
          <Text c="dimmed" size="sm">
            {subtitle}
          </Text>
        </Stack>

        <Button
          variant="default"
          fullWidth
          size="md"
          radius="md"
          leftSection={<GoogleIcon />}
          loading={googleLoading}
          onClick={handleGoogle}
        >
          {googleButtonLabel}
        </Button>

        <Divider
          label={dividerLabel}
          labelPosition="center"
          my="lg"
          styles={{ label: { color: "var(--mantine-color-dimmed)", fontSize: 12 } }}
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert color="red" radius="md" p="sm" variant="light">
                <Text size="sm">{error}</Text>
              </Alert>
            )}

            {mode === "register" && (
              <TextInput label={nameLabel} placeholder={namePlaceholder} radius="md" {...form.getInputProps("name")} />
            )}

            <TextInput label={emailLabel} placeholder={emailPlaceholder} radius="md" {...form.getInputProps("email")} />

            <PasswordInput
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              radius="md"
              {...form.getInputProps("password")}
            />

            {mode === "login" && forgotPasswordLabel && (
              <Anchor href={forgotPasswordHref} size="xs" c="dimmed" style={{ alignSelf: "flex-end", marginTop: -8 }}>
                {forgotPasswordLabel}
              </Anchor>
            )}

            <Button type="submit" fullWidth size="md" radius="md" loading={loading} mt="xs">
              {submitButtonLabel}
            </Button>
          </Stack>
        </form>

        <Text ta="center" size="sm" c="dimmed" mt="xl">
          {footerText}{" "}
          <Anchor href={footerLinkHref} size="sm" fw={500}>
            {footerLinkLabel}
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
