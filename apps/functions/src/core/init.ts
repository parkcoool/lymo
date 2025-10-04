import { defineSecret } from "firebase-functions/params";
import { onInit } from "firebase-functions";
import { log } from "firebase-functions/logger";

import { initSpotify } from "./spotify";
import { initAi } from "./genkit";

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

const initializeDev = async () => {
  await initSpotify(
    "f81a68e0a9054564b75668f7dcb3cb39",
    spotifyClientSecret.value()
  );

  log("Initialized development services");
};

const initializeProd = async () => {
  initAi(geminiApiKey.value());
  await initSpotify(
    "f81a68e0a9054564b75668f7dcb3cb39",
    spotifyClientSecret.value()
  );

  log("Initialized production services");
};

if (
  process.env.GENKIT_ENV === "dev" ||
  process.env.FUNCTIONS_EMULATOR === "true"
) {
  initializeDev();
} else {
  onInit(initializeProd);
}
