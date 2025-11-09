import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { summarizeSongFlow } from "./summarizeSong.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const summarizeSong = onCallGenkit(
  {
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  summarizeSongFlow
);

export default summarizeSong;
