"use client";

import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { IconRobot } from "./Icons";

export function SignInScreen() {
  return (
    <main className="signin-screen">
      <div className="signin-card">
        <div className="signin-logo">
          <IconRobot className="signin-robot-icon" />
        </div>
        <h1 className="signin-title">Agent Hub</h1>
        <p className="signin-subtitle">
          Grant AI agents time-limited signing access to your wallets — without
          exposing private keys.
        </p>
        <div className="signin-features">
          <div className="signin-feature">
            <span className="signin-feature-icon">⏱</span>
            <span>24-hour access windows</span>
          </div>
          <div className="signin-feature">
            <span className="signin-feature-icon">🔑</span>
            <span>Per-wallet delegation</span>
          </div>
          <div className="signin-feature">
            <span className="signin-feature-icon">🛡</span>
            <span>Revoke anytime</span>
          </div>
        </div>
        <AuthButton />
        <p className="signin-powered">Powered by CDP Delegated Signing</p>
      </div>
    </main>
  );
}
