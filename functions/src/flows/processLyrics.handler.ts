import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { processLyricsFlow } from "./processLyrics.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const processLyrics = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  processLyricsFlow
);

export default processLyrics;
