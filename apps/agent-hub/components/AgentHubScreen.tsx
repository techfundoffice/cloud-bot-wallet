"use client";

import { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

import { WalletCard } from "./WalletCard";
import { CreateWalletCard } from "./CreateWalletCard";
import { IconRobot } from "./Icons";

const MAX_WALLETS = 3;

export function AgentHubScreen() {
  const { currentUser } = useCurrentUser();

  // Start from the accounts the SDK knows about, then append any we create this session
  const [extraAccounts, setExtraAccounts] = useState<string[]>([]);

  // Merge and dedup: SDK may reflect new accounts after a refresh, so Set removes duplicates
  const evmAccounts = useMemo(
    () => [...new Set([...(currentUser?.evmAccounts ?? []), ...extraAccounts])],
    [currentUser?.evmAccounts, extraAccounts]
  );

  const handleCreated = useCallback((address: string) => {
    setExtraAccounts((prev) => [...prev, address]);
  }, []);

  const showCreateCard = evmAccounts.length < MAX_WALLETS;

  return (
    <div className="hub-layout">
      <header className="hub-header">
        <div className="hub-header-inner">
          <div className="hub-brand">
            <IconRobot className="hub-brand-icon" />
            <span className="hub-brand-name">Agent Hub</span>
          </div>
          <div className="hub-header-actions">
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="hub-main">
        <div className="hub-main-inner">
          <div className="hub-hero">
            <h2 className="hub-title">Your Agent Wallets</h2>
            <p className="hub-subtitle">
              Grant AI agents temporary signing access to individual wallets.
              Delegations expire automatically after 24 hours and can be revoked
              at any time.
            </p>
          </div>

          <div className="wallets-grid">
            {evmAccounts.map((address, i) => (
              <WalletCard
                key={address}
                address={address}
                userId={currentUser?.userId ?? ""}
                index={i}
              />
            ))}
            {showCreateCard && <CreateWalletCard onCreated={handleCreated} />}
          </div>

          <div className="hub-explainer">
            <h3 className="explainer-title">How it works</h3>
            <div className="explainer-steps">
              <div className="explainer-step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <strong>Grant access</strong>
                  <p>
                    Click &ldquo;Grant Agent Access&rdquo; to create a 24-hour delegation for a
                    specific wallet. The backend can now sign on its behalf.
                  </p>
                </div>
              </div>
              <div className="explainer-step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <strong>Agent signs autonomously</strong>
                  <p>
                    Using the delegation, the agent can sign transactions for that wallet without
                    your online presence — no private keys exposed.
                  </p>
                </div>
              </div>
              <div className="explainer-step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <strong>Auto-expire or revoke</strong>
                  <p>
                    Delegations expire automatically after 24 hours. You can also revoke at any
                    time for immediate termination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
