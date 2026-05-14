"use client";

import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";
import { Loading } from "@/components/Loading";
import { SignInScreen } from "@/components/SignInScreen";
import { AgentHubScreen } from "@/components/AgentHubScreen";

export default function Home() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  return (
    <div className="app">
      {!isInitialized && <Loading />}
      {isInitialized && (
        <>
          {!isSignedIn && <SignInScreen />}
          {isSignedIn && <AgentHubScreen />}
        </>
      )}
    </div>
  );
}
