export interface SpotifyResult {
  id: string;
  title: string;
  artist: string[];
  album: string | null;
  coverUrl: string;
  publishedAt: string | null;
  duration: number;
}
