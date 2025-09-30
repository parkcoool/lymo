import { Lyrics } from "../shared/lyrics";

/**
 * tracks 컬렉션의 문서
 */
export interface TrackDoc {
  album: string | null;
  artist: string;
  coverUrl: string;
  duration: number;
  publishedAt: string | null;
  title: string;
}

/**
 * tracks 컬렉션의 상세 문서
 */
export interface TrackDetailDoc {
  lyrics: Lyrics[];
  lyricsProvider: string;
  summary: string;
}
