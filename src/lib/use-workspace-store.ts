import { useCallback, useEffect, useState } from "react";

const PREFIX = "workspace:";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Local-first persistence for the single-user workspace.
 * No user IDs involved — swap the read/write calls for a DB adapter later.
 */
export function useWorkspaceStore<T>(key: string, initial: T) {
  const [hydrated, setHydrated] = useState(false);
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(read<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(PREFIX + key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable — keep in-memory state */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}
