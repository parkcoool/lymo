import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { translateLyricsFlow } from "./translateLyrics.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const translateLyrics = onCallGenkit(
  {
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  translateLyricsFlow
);

export default translateLyrics;
