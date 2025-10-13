export interface RawLRCLIBResult {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string | null;
}

export interface LRCLIBResult {
  lyrics: {
    start: number;
    end: number;
    text: string;
  }[];
  title: string;
  artist: string;
  album: string;
  duration: number;
}
