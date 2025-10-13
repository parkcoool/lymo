import { StreamingCallback } from "genkit";

import { MetadataUpdateEvent, LyricsUpdateEvent } from "@lymo/schemas/event";

import { SpotifyResult } from "../../types/spotify";
import { LRCLIBResult } from "../../types/lrclib";

export default function sendInitialChunks(
  sendChunk: StreamingCallback<MetadataUpdateEvent | LyricsUpdateEvent>,
  spotifyResult: SpotifyResult,
  lrclibResult: LRCLIBResult
) {
  // 메타데이터 전송
  sendChunk({
    event: "metadata_update",
    data: {
      id: spotifyResult.id,
      title: spotifyResult.title,
      artist: spotifyResult.artist.join(", "),
      album: spotifyResult.album,
      coverUrl: spotifyResult.coverUrl,
      publishedAt: spotifyResult.publishedAt,
      lyricsProvider: "LRCLIB",
    },
  });

  // 가사 전송
  sendChunk({
    event: "lyrics_update",
    data: lrclibResult.lyrics,
  });
}
