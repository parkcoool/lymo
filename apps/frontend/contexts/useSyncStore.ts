import { createElement, useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

interface SyncContextStates {
  /**
   * @description 기기 미디어와의 동기화 상태
   */
  isSynced: boolean;
}

interface SyncContextActions {
  /**
   * @description 기기 미디어와의 동기화 상태를 설정합니다.
   * @param isSynced 기기 미디어와의 동기화 상태
   */
  setIsSynced: (isSynced: boolean) => void;
}

type SyncContextValues = SyncContextStates & SyncContextActions;

const [SyncContextProvider, _useSyncStore] = buildContext<SyncContextValues>(
  "SyncContext",
  {
    isSynced: false,
    setIsSynced: () => {},
  }
);

function SyncProvider({ children }: { children: ReactNode }) {
  const [isSynced, setIsSynced] = useState(false);

  return createElement(SyncContextProvider, {
    isSynced,
    setIsSynced,
    children,
  });
}

/**
 * @description 기기 미디어와의 동기화 상태를 관리하는 컨텍스트 훅입니다.
 */
const useSyncStore = _useSyncStore;

export { SyncProvider, useSyncStore };
