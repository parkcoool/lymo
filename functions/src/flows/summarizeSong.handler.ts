import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { summarizeSongFlow } from "./summarizeSong.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const summarizeSong = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  summarizeSongFlow
);

export default summarizeSong;
