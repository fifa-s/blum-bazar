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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/inzeraty";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: validateEmail,
      password: (v) => (v.length > 0 ? null : "Password is required"),
    },
  });

  async function handleSubmit(values: typeof form.values) {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
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
            Welcome back
          </Title>
          <Text c="dimmed" size="sm">
            Sign in to your account to continue.
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
          Continue with Google
        </Button>

        <Divider
          label="or sign in with email"
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

            <TextInput label="Email" placeholder="you@example.com" radius="md" {...form.getInputProps("email")} />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              {...form.getInputProps("password")}
            />

            <Anchor href="/forgot-password" size="xs" c="dimmed" style={{ alignSelf: "flex-end", marginTop: -8 }}>
              Forgot password?
            </Anchor>

            <Button type="submit" fullWidth size="md" radius="md" loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Text ta="center" size="sm" c="dimmed" mt="xl">
          Don&apos;t have an account?{" "}
          <Anchor href="/register" size="sm" fw={500}>
            Create one
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
