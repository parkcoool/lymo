import { onCallGenkit } from "firebase-functions/v2/https";

import { processLyricsFlow } from "./processLyrics.flow";

const processLyrics = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: ["GEMINI_API_KEY"],
    region: "asia-northeast3",
  },
  processLyricsFlow
);

export default processLyrics;
