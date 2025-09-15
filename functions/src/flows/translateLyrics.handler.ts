import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { translateLyricsFlow } from "./translateLyrics.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const translateLyrics = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  translateLyricsFlow
);

export default translateLyrics;
