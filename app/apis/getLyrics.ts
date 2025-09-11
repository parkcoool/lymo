import api from "~/apis";
import type { LyricsParagraph, LyricsProvider } from "~/types/song";

interface GetLyricsProps {
  lyricsProvider: LyricsProvider | null;
  lyricsId: string | null;
}

export interface GetLyricsResponse {
  lyrics: LyricsParagraph[];
}

export default async function getLyrics({
  lyricsProvider,
  lyricsId,
}: GetLyricsProps) {
  return await api.get<GetLyricsResponse>("/lyrics", {
    params: { lyricsProvider, lyricsId },
  });
}
