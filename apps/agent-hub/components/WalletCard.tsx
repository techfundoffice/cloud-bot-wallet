"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useCreateDelegationForAccount,
  useGetDelegationForAccount,
  useRevokeDelegationForAccount,
} from "@coinbase/cdp-hooks";

import { IconCopy, IconCheck, IconWallet } from "./Icons";
import {
  type DelegationRecord,
  saveDelegation,
  loadDelegation,
  clearDelegation,
  isExpired,
  timeUntilExpiry,
} from "@/lib/delegationStorage";
import { AGENT_EVENTS } from "@/lib/agentEvents";

let _actionSeq = 0;

type Props = {
  address: string;
  userId: string;
  index: number;
};

type DelegationStatus = "none" | "active" | "expired" | "loading";

type AgentAction = {
  id: number;
  signedAt: string;
  signature: string;
  message: string;
};

export function WalletCard({ address, userId, index }: Props) {
  const { createDelegationForAccount } = useCreateDelegationForAccount();
  const { getDelegationForAccount } = useGetDelegationForAccount();
  const { revokeDelegationForAccount } = useRevokeDelegationForAccount();

  const [record, setRecord] = useState<DelegationRecord | null>(() =>
    loadDelegation(address)
  );
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [agentLog, setAgentLog] = useState<AgentAction[]>([]);
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  const esRef = useRef<EventSource | null>(null);

  // Close EventSource on unmount
  useEffect(() => {
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, []);

  // Fetch live delegation status from API on mount
  useEffect(() => {
    let cancelled = false;
    setIsFetchingStatus(true);
    getDelegationForAccount({ address })
      .then((result) => {
        if (cancelled) return;
        const newRecord: DelegationRecord = { expiresAt: result.expiresAt };
        saveDelegation(address, newRecord);
        setRecord(newRecord);
      })
      .catch(() => {
        if (cancelled) return;
        clearDelegation(address);
        setRecord(null);
      })
      .finally(() => {
        if (!cancelled) setIsFetchingStatus(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address, getDelegationForAccount]);

  const status: DelegationStatus = isFetchingStatus
    ? "loading"
    : record === null
      ? "none"
      : isExpired(record)
        ? "expired"
        : "active";

  useEffect(() => {
    const update = () => {
      if (record && !isExpired(record)) {
        setTimeLeft(timeUntilExpiry(record));
      } else {
        setTimeLeft(null);
      }
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [record]);

  const handleGrant = useCallback(async () => {
    setIsActing(true);
    setError(null);
    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const result = await createDelegationForAccount({ address, expiresAt });
      const newRecord: DelegationRecord = { expiresAt: result.expiresAt };
      saveDelegation(address, newRecord);
      setRecord(newRecord);
      setTimeLeft(timeUntilExpiry(newRecord));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to grant access");
    } finally {
      setIsActing(false);
    }
  }, [address, createDelegationForAccount]);

  const handleRevoke = useCallback(async () => {
    // Stop any running stream first
    esRef.current?.close();
    esRef.current = null;
    setIsStreaming(false);

    setIsActing(true);
    setError(null);
    try {
      await revokeDelegationForAccount({ address });
      clearDelegation(address);
      setRecord(null);
      setTimeLeft(null);
      setAgentLog([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke access");
    } finally {
      setIsActing(false);
    }
  }, [address, revokeDelegationForAccount]);

  const handleStartAgent = useCallback(() => {
    if (esRef.current) return; // already running

    setError(null);
    const es = new EventSource(
      `/api/agent/stream?userId=${encodeURIComponent(userId)}&address=${encodeURIComponent(address)}`
    );
    esRef.current = es;
    setIsStreaming(true);

    es.addEventListener(AGENT_EVENTS.SIGNATURE, (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as {
          signedAt: string;
          message: string;
          signature: string;
        };
        setAgentLog((prev) => [{ id: ++_actionSeq, ...data }, ...prev].slice(0, 20));
      } catch {
        // ignore parse error
      }
    });

    // Server-sent error events (distinct from connection errors)
    es.addEventListener(AGENT_EVENTS.SERVER_ERROR, (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as {
          error: string;
          fatal: boolean;
        };
        setError(data.error);
        if (data.fatal) {
          es.close();
          esRef.current = null;
          setIsStreaming(false);
        }
      } catch {
        // ignore
      }
    });

    // Connection-level error (dropped, server crashed, etc.)
    es.onerror = () => {
      es.close();
      esRef.current = null;
      setIsStreaming(false);
    };
  }, [userId, address]);

  const handleStopAgent = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setIsStreaming(false);
  }, []);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [address]);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatSig = (sig: string) => `${sig.slice(0, 12)}…${sig.slice(-6)}`;
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const isLoading = isActing || status === "loading";

  return (
    <div className={`wallet-card wallet-card--${status === "loading" ? "none" : status}`}>
      {/* Header */}
      <div className="wallet-card-header">
        <div className="wallet-card-icon">
          <IconWallet className="wallet-icon" />
        </div>
        <div className="wallet-card-meta">
          <span className="wallet-card-label">Wallet {index + 1}</span>
          <button
            className="wallet-address-btn"
            onClick={copyAddress}
            aria-label="Copy wallet address"
            title={address}
          >
            <span className="wallet-address-text">{formatAddress(address)}</span>
            {isCopied ? (
              <IconCheck className="copy-icon copy-icon--check" />
            ) : (
              <IconCopy className="copy-icon" />
            )}
          </button>
        </div>
        {status !== "loading" ? (
          <div className={`status-badge status-badge--${status}`}>
            <span className={`status-dot status-dot--${status}`} />
            {status === "none" && "No Access"}
            {status === "active" && "Active"}
            {status === "expired" && "Expired"}
          </div>
        ) : (
          <div className="status-badge">
            <span className="btn-spinner btn-spinner--small" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="wallet-card-body">
        {status === "active" && record && (
          <div className="delegation-info">
            <div className="delegation-row">
              <span className="delegation-label">Expires in</span>
              <span className="delegation-expiry">{timeLeft ?? "< 1m"}</span>
            </div>
            <div className="delegation-row">
              <span className="delegation-label">Until</span>
              <span className="delegation-until">
                {new Date(record.expiresAt).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {status === "expired" && (
          <div className="delegation-expired-notice">
            Agent access has expired. Grant a new 24h window to re-enable.
          </div>
        )}

        {status === "none" && (
          <div className="delegation-none-notice">
            No agent currently has signing access to this wallet.
          </div>
        )}

        {/* Agent activity log */}
        {agentLog.length > 0 && (
          <div className="agent-log">
            <div className="agent-log-header">
              <span className="agent-log-title">Agent Activity</span>
              <div className="agent-log-header-right">
                {isStreaming && (
                  <span className="agent-live-badge">
                    <span className="agent-live-dot" />
                    Live
                  </span>
                )}
                <span className="agent-log-count">
                  {agentLog.length} action{agentLog.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="agent-log-entries">
              {agentLog.map((action) => (
                <div key={action.id} className="agent-log-entry">
                  <div
                    className="agent-log-row"
                    onClick={() =>
                      setExpandedAction(expandedAction === action.id ? null : action.id)
                    }
                  >
                    <span className="log-time">{formatTime(action.signedAt)}</span>
                    <span className="log-sig">{formatSig(action.signature)}</span>
                    <span className="log-chevron">
                      {expandedAction === action.id ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedAction === action.id && (
                    <div className="agent-log-detail">
                      <div className="log-detail-row">
                        <span className="log-detail-label">Message</span>
                        <pre className="log-detail-value log-detail-message">
                          {action.message}
                        </pre>
                      </div>
                      <div className="log-detail-row">
                        <span className="log-detail-label">Signature</span>
                        <span className="log-detail-value log-detail-sig">
                          {action.signature}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="delegation-error">{error}</div>}
      </div>

      {/* Footer actions */}
      <div className="wallet-card-footer">
        {(status === "none" || status === "expired") && (
          <button
            className="action-btn action-btn--grant"
            onClick={handleGrant}
            disabled={isLoading}
          >
            {isActing ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <span className="btn-icon">⚡</span>
                {status === "expired" ? "Renew Agent Access (24h)" : "Grant Agent Access (24h)"}
              </>
            )}
          </button>
        )}

        {status === "active" && (
          <div className="footer-actions">
            {isStreaming ? (
              <button
                className="action-btn action-btn--stop"
                onClick={handleStopAgent}
                disabled={isLoading}
              >
                <span className="btn-icon">■</span>
                Stop Agent
              </button>
            ) : (
              <button
                className="action-btn action-btn--start"
                onClick={handleStartAgent}
                disabled={isLoading}
              >
                <span className="btn-icon">▶</span>
                Start Agent
              </button>
            )}
            <button
              className="action-btn action-btn--revoke"
              onClick={handleRevoke}
              disabled={isLoading || isStreaming}
            >
              {isActing ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <span className="btn-icon">✕</span>
                  Revoke
                </>
              )}
            </button>
          </div>
        )}

        {status === "loading" && (
          <button className="action-btn action-btn--grant" disabled>
            <span className="btn-spinner" />
          </button>
        )}
      </div>
    </div>
  );
}
