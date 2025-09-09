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
  coverUrl: string | null;
  createdAt: string;
}

export interface CompactSong {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string | null;
}

export interface CompactSongWithGoodLyrics extends CompactSong {
  lyricsPreview: string;
}

export interface LyricsSentence {
  text: string;
  translation: string | null;
}

export interface LyricsParagraph {
  sentences: { [timestamp: number]: LyricsSentence };
  description: string | null;
}

export type LyricsProvider = "LRCLib";

export type SourceProvider = "YouTube";
