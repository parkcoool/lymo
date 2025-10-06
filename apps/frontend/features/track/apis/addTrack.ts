import { fetch } from "expo/fetch";
import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";
import type { Lyrics, Track, TrackDetail } from "@lymo/schemas/shared";

import getTrack from "@/features/track/apis/getTrack";

type Chunk = { message: AddTrackFlowStream };
type Result = { result: AddTrackFlowOutput };

export default async function* addTrack(
  { title, artist, duration }: AddTrackFlowInput,
  signal?: AbortSignal
): AsyncGenerator<Track & TrackDetail> {
  const resp = await fetch("https://addtrack-au5g5tbwtq-du.a.run.app", {
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ data: { title, artist, duration } }),
    signal,
  });
  const reader = resp.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  const track: Track & TrackDetail = {
    id: "",
    title,
    artist,
    album: null,
    coverUrl: "",
    publishedAt: null,
    duration,
    lyrics: [],
    lyricsProvider: "",
    summary: "",
  };
  console.log("[START]", { title, artist, duration });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // "data: { ... }"의 형태로 수신됨
    // 위 형태가 반복되어 나타날 수 있음
    const rawString = decoder.decode(value, { stream: true });
    const lines = rawString.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const jsonString = line.replaceAll("data: ", "").trim();
      const obj = JSON.parse(jsonString);

      if (isChunk(obj)) {
        processChunk(track, obj);
      } else if (isResult(obj)) {
        await processResult(track, obj);
      } else {
        throw new Error("Invalid chunk format: " + jsonString);
      }

      // TODO: 알고리즘 개선
      yield JSON.parse(JSON.stringify(track));
    }
  }
}

function isChunk(obj: any): obj is Chunk {
  return (
    typeof obj === "object" &&
    typeof obj.message === "object" &&
    typeof obj.message.event === "string" &&
    typeof obj.message.data === "object"
  );
}

function isResult(obj: any): obj is Result {
  return typeof obj === "object" && typeof obj.result === "object";
}

function processChunk(track: Track & TrackDetail, chunk: Chunk) {
  const { event, data } = chunk.message;
  console.log(`[${event}]`, data);

  switch (event) {
    case "metadata_update": {
      Object.assign(track, data);
      break;
    }

    case "lyrics_set": {
      expandSentences(track.lyrics, data.paragraphIndex, data.sentenceIndex);
      track.lyrics[data.paragraphIndex].sentences[data.sentenceIndex] = {
        text: data.text,
        start: data.start,
        end: data.end,
        translation: "",
      };
      break;
    }

    case "translation_set": {
      expandSentences(track.lyrics, data.paragraphIndex, data.sentenceIndex);
      track.lyrics[data.paragraphIndex].sentences[
        data.sentenceIndex
      ].translation = data.text;
      break;
    }

    case "summary_append": {
      track.summary += data.summary;
      break;
    }

    case "paragraph_summary_append": {
      expandParagraphs(track.lyrics, data.paragraphIndex);
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

async function processResult(track: Track & TrackDetail, result: Result) {
  const { duplicate, notFound, id } = result.result;
  console.log("[RESULT]", result.result);

  if (duplicate && id) {
    const newTrack = await getTrack({ trackId: id });
    Object.assign(track, newTrack);
  } else if (notFound) {
    track.id = "";
  } else if (id) {
    track.id = id;
  }
}

function expandParagraphs(lyrics: Lyrics, paragraphIndex: number) {
  while (paragraphIndex >= lyrics.length) {
    lyrics.push({ summary: null, sentences: [] });
  }
}

function expandSentences(
  lyrics: Lyrics,
  paragraphIndex: number,
  sentenceIndex: number
) {
  expandParagraphs(lyrics, paragraphIndex);

  const paragraph = lyrics[paragraphIndex];
  while (sentenceIndex >= paragraph.sentences.length) {
    paragraph.sentences.push({ text: "", start: 0, end: 0, translation: "" });
  }
}
