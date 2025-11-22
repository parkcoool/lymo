import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { getTrackFromMetadataFlow } from "./getTrackFromMetadata.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

const getTrackFromMetadata = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
    secrets: [geminiApiKey, spotifyClientSecret],
  },
  getTrackFromMetadataFlow
);

export default getTrackFromMetadata;
