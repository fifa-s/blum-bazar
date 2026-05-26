"use client";

import {
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { PageLogo } from "./PageLogo";

interface NavLink {
  label: string;
  href: string;
}

interface AppHeaderProps {
  navLinks: NavLink[];
  loginHref?: string;
  registerHref?: string;
  loginLabel?: string;
  registerLabel?: string;
  profileHref?: string;
}

function UserMenu({ profileHref }: { profileHref: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0].toUpperCase() ?? "?");

  return (
    <Menu width={200} position="bottom-end" offset={8} withArrow arrowPosition="center">
      <MenuTarget>
        <UnstyledButton>
          <Group gap={8} style={{ cursor: "pointer" }}>
            <Avatar src={user?.image} size={32} radius="xl" color="blue">
              {initials}
            </Avatar>
            <Text size="sm" fw={500} visibleFrom="sm">
              {user?.name ?? user?.email}
            </Text>
            <ChevronDownIcon size={14} style={{ color: "var(--mantine-color-dimmed)" }} />
          </Group>
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        <Box px="sm" py="xs">
          <Text size="xs" c="dimmed" truncate>
            {user?.email}
          </Text>
        </Box>
        <MenuDivider />
        <MenuItem leftSection={<UserIcon size={14} />} component={Link} href={profileHref}>
          Profile
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<LogOutIcon size={14} />} color="red" onClick={() => signOut({ redirectTo: "/" })}>
          Sign out
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}

function AuthButtons({
  loginHref,
  registerHref,
  loginLabel,
  registerLabel,
}: Pick<AppHeaderProps, "loginHref" | "registerHref" | "loginLabel" | "registerLabel">) {
  return (
    <Group gap="xs">
      <Button variant="subtle" size="sm" radius="md" component={Link} href={loginHref ?? "/login"}>
        {loginLabel}
      </Button>
      <Button size="sm" radius="md" component={Link} href={registerHref ?? "/register"}>
        {registerLabel}
      </Button>
    </Group>
  );
}

export function AppHeader({
  navLinks,
  loginHref = "/login",
  registerHref = "/register",
  loginLabel = "Sign in",
  registerLabel = "Get started",
  profileHref = "/profile",
}: AppHeaderProps) {
  const { data: session, status } = useSession();

  return (
    <Box
      component="header"
      style={{
        height: 56,
        borderBottom: "1px solid var(--mantine-color-gray-2)",
        backdropFilter: "blur(8px)",
        backgroundColor: "color-mix(in srgb, var(--mantine-color-body) 85%, transparent)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Group h="100%" px="md" justify="space-between" wrap="nowrap" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Left — logo */}
        <PageLogo />

        {/* Middle — nav links */}
        <Group gap={4} visibleFrom="sm">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="subtle"
              size="sm"
              radius="md"
              component={Link}
              href={link.href}
              color="gray"
            >
              {link.label}
            </Button>
          ))}
        </Group>

        {/* Right — auth */}
        <Box>
          {status === "loading" ? (
            <Skeleton height={32} width={120} radius="md" />
          ) : session ? (
            <UserMenu profileHref={profileHref} />
          ) : (
            <AuthButtons
              loginHref={loginHref}
              loginLabel={loginLabel}
              registerHref={registerHref}
              registerLabel={registerLabel}
            />
          )}
        </Box>
      </Group>
    </Box>
  );
}
