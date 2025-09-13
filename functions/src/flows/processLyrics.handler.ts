import { onCallGenkit } from "firebase-functions/https";

import googleAIapiKey from "../core/secret";
import { processLyricsFlow } from "./processLyrics.flow";

const processLyrics = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [googleAIapiKey],
    region: "asia-northeast3",
  },
  processLyricsFlow
);

export default processLyrics;
