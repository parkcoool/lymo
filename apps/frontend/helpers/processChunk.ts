import type { Track, TrackDetail } from "@lymo/schemas/shared";

import type { Chunk, ProcessChunkState } from "@/apis/addTrack";
import findIndex from "@/utils/findIndex";

export default function processChunk(
  track: Track & TrackDetail,
  state: ProcessChunkState,
  chunk: Chunk
) {
  const { event, data } = chunk.message;
  console.log(`[${event}]`, data);

  switch (event) {
    case "metadata_update": {
      Object.assign(track, data);
      break;
    }

    case "lyrics_update": {
      track.lyrics = [
        {
          sentences: data.map((s) => ({ ...s, translation: null })),
          summary: null,
        },
      ];
      break;
    }

    case "translation_set": {
      const index = findIndex(
        track.lyrics.map((p) => p.sentences),
        data.sentenceIndex
      );

      if (index === null)
        throw new Error("Failed to find sentence index for translation");

      const { outer: p, inner: s } = index;

      if (track.lyrics[p].sentences[s].translation === null)
        track.lyrics[p].sentences[s].translation = "";
      track.lyrics[p].sentences[s].translation += data.text;

      break;
    }

    case "lyrics_group": {
      const breaks = data;
      const sentences = track.lyrics[0].sentences;
      track.lyrics = [];

      let lastBreak = -1;
      for (const breakIndex of breaks) {
        track.lyrics.push({
          sentences: sentences.slice(lastBreak + 1, breakIndex + 1),
          summary: null,
        });
        lastBreak = breakIndex;
      }
      track.lyrics.push({
        sentences: sentences.slice(lastBreak + 1),
        summary: null,
      });

      state.isLyricsGrouped = true;
      break;
    }

    case "summary_append": {
      track.summary += data.summary;
      break;
    }

    case "paragraph_summary_append": {
      const paragraph = track.lyrics[data.paragraphIndex];
      if (paragraph.summary) paragraph.summary += data.summary;
      else paragraph.summary = data.summary;
      break;
    }

    case "complete": {
      break;
    }
  }
}
