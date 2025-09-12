import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { setGlobalOptions } from "firebase-functions";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import dotenv from "dotenv";

import { registerProcessLyricsFlow } from "./processLyricsFlow";
import { registerGetLyricsTool } from "./getLyricsTool";
import { registerGetYouTubeTool } from "./getYouTubeTool";

dotenv.config();

const ai = genkit({
  model: "googleai/gemini-2.5-flash",
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});

const googleAIapiKey = defineSecret("GEMINI_API_KEY");

registerGetLyricsTool(ai);
registerGetYouTubeTool(ai);
const processLyricsFlow = registerProcessLyricsFlow(ai);

export const processLyrics = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [googleAIapiKey],
    region: "asia-northeast3",
  },
  processLyricsFlow
);

setGlobalOptions({ maxInstances: 10 });
