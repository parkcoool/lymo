import React, { useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

interface SyncContextStates {
  isSynced: boolean;
}

interface SyncContextActions {
  setIsSynced: (isSynced: boolean) => void;
}

type SyncContextValues = SyncContextStates & SyncContextActions;

const [SyncContextProvider, useSyncStore] = buildContext<SyncContextValues>(
  "SyncContext",
  {
    isSynced: false,
    setIsSynced: () => {},
  }
);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isSynced, setIsSynced] = useState(false);

  return React.createElement(SyncContextProvider, {
    isSynced,
    setIsSynced,
    children,
  });
}

export { useSyncStore };
