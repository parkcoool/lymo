import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";

import { retrieveTrackNoti as retrieveTrackNotiFlow } from "./flow";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

export const retrieveTrackNoti = onCallGenkit(
  {
    cors: true,
    region: "asia-northeast3",
    secrets: [spotifyClientSecret],
  },
  retrieveTrackNotiFlow
);
