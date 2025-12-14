import { createElement, useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

interface SyncContextStates {
  /**
   * 기기 미디어와의 동기화 상태
   */
  isSynced: boolean;
}

interface SyncContextActions {
  /**
   * 기기 미디어와의 동기화 상태를 설정합니다.
   * @param isSynced 기기 미디어와의 동기화 상태
   */
  setIsSynced: (isSynced: boolean) => void;
}

type SyncContextValues = SyncContextStates & SyncContextActions;

const [SyncContextProvider, useSyncStore] = buildContext<SyncContextValues>("SyncContext", {
  isSynced: false,
  setIsSynced: () => {},
});

function SyncProvider({ children }: { children: ReactNode }) {
  const [isSynced, setIsSynced] = useState(false);

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(SyncContextProvider, {
    isSynced,
    setIsSynced,
    children,
  });
}

export { SyncProvider, useSyncStore };
