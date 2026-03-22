import { useSyncExternalStore, useCallback } from "react";

export interface LogEntry {
  command: string;
  ok: boolean;
  message: string;
  timestamp: number;
}

let entries: LogEntry[] = [];
let listeners: Array<() => void> = [];

function emit() {
  for (const l of listeners) l();
}

export function pushLogEntry(entry: Omit<LogEntry, "timestamp">) {
  entries = [...entries, { ...entry, timestamp: Date.now() }].slice(-10);
  emit();
}

export function clearLog() {
  entries = [];
  emit();
}

export function useExecutionLog(): LogEntry[] {
  const subscribe = useCallback((cb: () => void) => {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  }, []);

  const getSnapshot = useCallback(() => entries, []);

  return useSyncExternalStore(subscribe, getSnapshot);
}
