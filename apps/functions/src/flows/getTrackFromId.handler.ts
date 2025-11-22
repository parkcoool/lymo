import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { getTrackFromIdFlow } from "./getTrackFromId.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

const getTrackFromId = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
    secrets: [geminiApiKey, spotifyClientSecret],
  },
  getTrackFromIdFlow
);

export default getTrackFromId;
