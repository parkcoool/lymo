import { createElement, useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";
import type { Track } from "@lymo/schemas/shared";

import type { DeviceMedia } from "@/types/nativeModules";

type TrackSource =
  | {
      from: "device";
      track: Pick<
        DeviceMedia,
        "title" | "artist" | "album" | "duration" | "coverUrl"
      >;
    }
  | {
      from: "manual";
      track: Pick<Track, "id" | "title" | "coverUrl">;
    };

interface TrackSourceContextStates {
  /**
   * @description 현재 활성화된 트랙의 출처
   */
  trackSource?: TrackSource;
}

interface TrackSourceContextActions {
  /**
   * @description 현재 활성화된 트랙의 출처를 설정합니다.
   * @param track 현재 활성화된 트랙의 출처
   */
  setTrackSource: (track?: TrackSource) => void;
}

type TrackSourceContextValues = TrackSourceContextStates &
  TrackSourceContextActions;

const [TrackSourceContextProvider, _useTrackSourceStore] =
  buildContext<TrackSourceContextValues>("TrackSourceContext", {
    trackSource: undefined,
    setTrackSource: () => {},
  });

function TrackSourceProvider({ children }: { children: ReactNode }) {
  const [trackSource, setTrackSource] = useState<TrackSource | undefined>(
    undefined
  );

  return createElement(TrackSourceContextProvider, {
    trackSource,
    setTrackSource,
    children,
  });
}

/**
 * @description 현재 활성화된 트랙의 출처를 관리하는 컨텍스트 훅입니다.
 */
const useTrackSourceStore = _useTrackSourceStore;

export { TrackSourceProvider, useTrackSourceStore };
