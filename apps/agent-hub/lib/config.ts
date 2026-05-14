import { type Config } from "@coinbase/cdp-react";
import { QueryClient } from "@tanstack/react-query";

export const cdpConfig: Config = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  ethereum: { createOnLogin: "eoa" },
  authMethods: ["email"],
  showCoinbaseFooter: true,
};

export const queryClient = new QueryClient();
