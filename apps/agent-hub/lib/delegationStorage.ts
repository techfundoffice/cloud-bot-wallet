/**
 * Lightweight local cache of delegation expiry times.
 * The CDP API has a `getDelegationForAccount` endpoint we use as the source of truth,
 * but we cache here to avoid a round-trip on initial render.
 */

export type DelegationRecord = {
  expiresAt: string; // ISO 8601
};

const key = (address: string) => `agent-hub-delegation:${address.toLowerCase()}`;

export function saveDelegation(address: string, record: DelegationRecord) {
  localStorage.setItem(key(address), JSON.stringify(record));
}

export function loadDelegation(address: string): DelegationRecord | null {
  const raw = localStorage.getItem(key(address));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DelegationRecord;
  } catch {
    return null;
  }
}

export function clearDelegation(address: string) {
  localStorage.removeItem(key(address));
}

export function isExpired(record: DelegationRecord): boolean {
  return new Date(record.expiresAt) <= new Date();
}

/** Returns a human-readable "Xh Ym" string until expiry, or null if expired. */
export function timeUntilExpiry(record: DelegationRecord): string | null {
  const ms = new Date(record.expiresAt).getTime() - Date.now();
  if (ms <= 0) return null;
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
