export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number;
  lyricsProvider: LyricsProvider;
  lyrics: LyricsParagraph[];
  sourceProvider: SourceProvider;
  sourceId: string;
  coverUrl: string | null;
  publishedAt: string | null;
  summary: string | null;
}

export interface CompactSong {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
}

export interface LyricalSong extends CompactSong {
  artist: string;
  lyricsPreview: string;
}

export interface LyricsSentence {
  text: string;
  translation: string | null;
  start: number;
  end: number;
}

export interface LyricsParagraph {
  sentences: LyricsSentence[];
  summary: string | null;
}

export type LyricsProvider = "LRCLib";

export type SourceProvider = "YouTube";

export interface SongDocument {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  publishedAt: string | null;
}

export interface SongDetailDocument {
  id: string;
  sourceProvider: SourceProvider;
  sourceId: string;
  summary: string;
  lyricsProvider: LyricsProvider;
  lyrics: {
    summary: string | null;
    sentences: {
      start: number;
      end: number;
      text: string;
      translation: string | null;
    }[];
  }[];
}

export type PlayerState =
  | "ready"
  | "buffering"
  | "fetching"
  | "streaming"
  | "idle";
