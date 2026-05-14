import { CdpClient } from "@coinbase/cdp-sdk";

// Reads CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET from env
export const cdp = new CdpClient();

export type CdpApiError = {
  statusCode: number;
  errorType: string;
  errorMessage: string;
};

/** Duck-type guard for the CDP SDK's APIError shape (not publicly exported). */
export function isCdpApiError(err: unknown): err is CdpApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    "errorType" in err &&
    "errorMessage" in err
  );
}

export function isFatalDelegationError(err: CdpApiError): boolean {
  return (
    err.statusCode === 403 ||
    err.errorType === "forbidden" ||
    err.errorType === "unauthorized"
  );
}

export const NO_DELEGATION_ERROR =
  "No active delegation for this wallet. Grant access first.";

export function buildHeartbeatMessage(
  userId: string,
  address: string,
  signedAt: string
): string {
  return `Agent heartbeat\nWallet: ${address}\nTimestamp: ${signedAt}\nI confirm this action was taken autonomously on behalf of user ${userId}.`;
}
