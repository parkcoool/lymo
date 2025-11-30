import { onInit } from "firebase-functions";
import { log } from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";

import { initAi } from "./genkit";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const initializeDev = async () => {
  log("Initialized development services");
};

const initializeProd = async () => {
  initAi(geminiApiKey.value());
  log("Initialized production services");
};

if (process.env.GENKIT_ENV === "dev" || process.env.FUNCTIONS_EMULATOR === "true") {
  initializeDev();
} else {
  onInit(initializeProd);
}
