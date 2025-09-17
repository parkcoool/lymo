import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { addSongFlow } from "./addSong.flow";

const lastfmApiKey = defineSecret("LASTFM_API_KEY");
const geminiApiKey = defineSecret("GEMINI_API_KEY");

const addSong = onCallGenkit(
  {
    cors: true,
    enforceAppCheck: true,
    timeoutSeconds: 300,
    secrets: [lastfmApiKey, geminiApiKey],
    region: "asia-northeast3",
  },
  addSongFlow
);

export default addSong;
