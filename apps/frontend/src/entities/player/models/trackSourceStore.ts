import { Track } from "@lymo/schemas/doc";
import { useState, ReactNode, createElement } from "react";
import { buildContext } from "react-simplikit";

import type { DeviceMedia } from "@/shared/types/DeviceMedia";

export type TrackSource =
  | {
      from: "device";
      track: DeviceMedia;
    }
  | {
      from: "manual";
      track: Track & { id: string };
    };

interface TrackSourceContextStates {
  /**
   * 현재 활성화된 트랙의 출처
   */
  trackSource?: TrackSource;
}

interface TrackSourceContextActions {
  /**
   * 현재 활성화된 트랙의 출처를 설정합니다.
   * @param track 현재 활성화된 트랙의 출처
   */
  setTrackSource: (track?: TrackSource) => void;
}

type TrackSourceContextValues = TrackSourceContextStates & TrackSourceContextActions;

const [TrackSourceContextProvider, useTrackSourceStore] = buildContext<TrackSourceContextValues>(
  "TrackSourceContext",
  {
    trackSource: undefined,
    setTrackSource: () => {},
  }
);

function TrackSourceProvider({ children }: { children: ReactNode }) {
  const [trackSource, setTrackSource] = useState<TrackSource | undefined>(undefined);

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(TrackSourceContextProvider, {
    trackSource,
    setTrackSource,
    children,
  });
}

export { TrackSourceProvider, useTrackSourceStore };
