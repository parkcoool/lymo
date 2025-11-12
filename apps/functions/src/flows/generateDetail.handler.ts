import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { generateDetailFlow } from "./generateDetail.flow";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");
const geminiApiKey = defineSecret("GEMINI_API_KEY");

const generateDetail = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    secrets: [spotifyClientSecret, geminiApiKey],
    region: "asia-northeast3",
  },
  generateDetailFlow
);

export default generateDetail;
