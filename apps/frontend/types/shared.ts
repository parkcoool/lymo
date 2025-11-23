import { LyricsDoc, ProviderDoc, TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

export type WithId<T> = T & { id: string };

export interface FullTrack {
  trackId: string;
  track: TrackDoc;
  providerId: string;
  provider: ProviderDoc;
  lyricsProvider: LyricsProvider;
  lyrics: LyricsDoc;
  trackDetail: TrackDetailDoc;
}

export interface StreamingFullTrack {
  trackId?: string;
  track?: TrackDoc;
  providerId?: string;
  provider?: ProviderDoc;
  lyricsProvider?: LyricsProvider;
  lyrics?: LyricsDoc;
  trackDetail: {
    summary?: string;
    lyricsSplitIndices: number[];
    lyricsProvider?: LyricsProvider;
    translations: (string | null)[];
    paragraphSummaries: (string | null)[];
  };
}
