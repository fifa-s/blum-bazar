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
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { validateEmail } from "@/helpers/validators";

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    initialValues: { name: "", email: "", password: "" },
    validate: {
      email: validateEmail,
      password: (v) => (v.length >= 8 ? null : "Password must be at least 8 characters"),
    },
  });

  async function handleSubmit(values: typeof form.values) {
    setLoading(true);
    setError("");

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

    // Auto sign-in after registration
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { redirectTo: "/dashboard" });
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
            Create an account
          </Title>
          <Text c="dimmed" size="sm">
            Sign up to get started.
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
          label="or sign up with email"
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

            <TextInput label="Name" placeholder="Your name" radius="md" {...form.getInputProps("name")} />

            <TextInput label="Email" placeholder="you@example.com" radius="md" {...form.getInputProps("email")} />

            <PasswordInput
              label="Password"
              placeholder="At least 8 characters"
              radius="md"
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth size="md" radius="md" loading={loading} mt="xs">
              Create account
            </Button>
          </Stack>
        </form>

        <Text ta="center" size="sm" c="dimmed" mt="xl">
          Already have an account?{" "}
          <Anchor href="/login" size="sm" fw={500}>
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
