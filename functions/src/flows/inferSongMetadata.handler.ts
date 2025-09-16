import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { inferSongMetadataFlow } from "./inferSongMetadata.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const inferSongMetadata = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  inferSongMetadataFlow
);

export default inferSongMetadata;
