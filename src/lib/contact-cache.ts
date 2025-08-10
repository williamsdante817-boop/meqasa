/**
 * Lightweight per-entity contact numbers cache in localStorage with TTL.
 * Keys are derived from contextKey (e.g., "listing:123" or "project:456").
 */

export interface CachedNumbersEntry {
  stph2: string; // primary display phone number
  stph3: string; // whatsapp phone number
  savedAt: number; // epoch ms
}

type CacheShape = Record<string, CachedNumbersEntry | undefined>;

const STORAGE_KEY = "meqasa_contact_numbers";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function safeRead(): CacheShape {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as CacheShape;
    }
    return {};
  } catch {
    return {};
  }
}

function safeWrite(cache: CacheShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore write errors
  }
}

export function getStoredNumbers(
  contextKey: string,
  ttlMs: number = DEFAULT_TTL_MS,
): CachedNumbersEntry | null {
  const cache = safeRead();
  const entry = cache[contextKey];
  if (!entry) return null;
  if (ttlMs > 0) {
    const age = Date.now() - entry.savedAt;
    if (age > ttlMs) {
      // expired; remove lazily
      delete cache[contextKey];
      safeWrite(cache);
      return null;
    }
  }
  return entry;
}

export function setStoredNumbers(
  contextKey: string,
  stph2: string,
  stph3: string,
): void {
  const cache = safeRead();
  cache[contextKey] = { stph2, stph3, savedAt: Date.now() };
  safeWrite(cache);
}

export function clearStoredNumbers(contextKey: string): void {
  const cache = safeRead();
  if (cache[contextKey]) {
    delete cache[contextKey];
    safeWrite(cache);
  }
}

export function clearAllExpired(ttlMs: number = DEFAULT_TTL_MS): void {
  const cache = safeRead();
  let mutated = false;
  const now = Date.now();
  for (const key of Object.keys(cache)) {
    const entry = cache[key];
    if (!entry) continue;
    if (ttlMs > 0 && now - entry.savedAt > ttlMs) {
      delete cache[key];
      mutated = true;
    }
  }
  if (mutated) safeWrite(cache);
}
