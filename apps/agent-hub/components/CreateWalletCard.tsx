"use client";

import { useCallback, useState } from "react";
import { useCreateEvmEoaAccount } from "@coinbase/cdp-hooks";

type Props = {
  onCreated: (address: string) => void;
};

export function CreateWalletCard({ onCreated }: Props) {
  const { createEvmEoaAccount } = useCreateEvmEoaAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(async () => {
    setIsCreating(true);
    setError(null);
    try {
      const address = await createEvmEoaAccount();
      onCreated(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setIsCreating(false);
    }
  }, [createEvmEoaAccount, onCreated]);

  return (
    <button
      className="create-wallet-card"
      onClick={handleCreate}
      disabled={isCreating}
      aria-label="Create a new wallet"
    >
      <div className="create-wallet-icon">
        {isCreating ? (
          <span className="btn-spinner" />
        ) : (
          <span className="create-wallet-plus">+</span>
        )}
      </div>
      <span className="create-wallet-label">
        {isCreating ? "Creating wallet…" : "Create a wallet"}
      </span>
      {error && <span className="create-wallet-error">{error}</span>}
    </button>
  );
}
