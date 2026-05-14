"use client";

import { CDPReactProvider } from "@coinbase/cdp-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { cdpConfig, queryClient } from "@/lib/config";
import { darkTheme } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CDPReactProvider config={cdpConfig} theme={darkTheme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CDPReactProvider>
  );
}
