"use client";

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { MaintenanceModal } from "@/components/infrastructure/MaintenanceModal";

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    return new QueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = new QueryClient();
  }

  return browserQueryClient;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MaintenanceModal>
        <SessionProvider>{children}</SessionProvider>
      </MaintenanceModal>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
