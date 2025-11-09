import React, { useState, ReactNode } from "react";
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
  trackSource?: TrackSource;
}

interface TrackSourceContextActions {
  setTrackSource: (track?: TrackSource) => void;
}

type TrackSourceContextValues = TrackSourceContextStates &
  TrackSourceContextActions;

const [TrackSourceContextProvider, useTrackSourceStore] =
  buildContext<TrackSourceContextValues>("TrackSourceContext", {
    trackSource: undefined,
    setTrackSource: () => {},
  });

export function TrackSourceProvider({ children }: { children: ReactNode }) {
  const [trackSource, setTrackSource] = useState<TrackSource | undefined>(
    undefined
  );

  return React.createElement(TrackSourceContextProvider, {
    trackSource,
    setTrackSource,
    children,
  });
}

export { useTrackSourceStore };
