import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { addTrackFlow } from "./addTrack.flow";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");
const lastfmApiKey = defineSecret("LASTFM_API_KEY");
const geminiApiKey = defineSecret("GEMINI_API_KEY");

const addTrack = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    secrets: [spotifyClientSecret, lastfmApiKey, geminiApiKey],
    region: "asia-northeast3",
  },
  addTrackFlow
);

export default addTrack;
