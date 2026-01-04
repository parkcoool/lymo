import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";

import { retrieveTrack as retrieveTrackFlow } from "./flow";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

export const retrieveTrack = onCallGenkit(
  {
    cors: true,
    region: "asia-northeast3",
    secrets: [spotifyClientSecret],
  },
  retrieveTrackFlow
);
