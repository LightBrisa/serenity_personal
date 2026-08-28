'use client';

import { useSyncExternalStore } from 'react';

export const ideaStorageKey = 'serenity-personal:nvda:idea';
export const thesisStorageKey = 'serenity-personal:nvda:thesis';

export function SavedDraftText({
  storageKey,
  fallback,
  className,
}: {
  storageKey: string;
  fallback: string;
  className?: string;
}) {
  const value = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => window.localStorage.getItem(storageKey)?.trim() || fallback,
    () => fallback,
  );

  return <span className={className}>{value}</span>;
}
