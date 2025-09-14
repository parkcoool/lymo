export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number;
  lyricsProvider: LyricsProvider | null;
  lyricsId: string | null;
  sourceProvider: SourceProvider;
  sourceId: string;
  coverUrl: string;
  createdAt: string;
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
  description: string | null;
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
  sourceProvider: string;
  sourceId: string;
  overview: string;
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
