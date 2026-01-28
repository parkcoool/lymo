import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { googleAI, vertexAI } from "@genkit-ai/google-genai";
import dotenv from "dotenv";
import { genkit } from "genkit";

dotenv.config();

const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI({
      apiKey: process.env.VERTEX_AI_KEY!,
    }),
  ],
});
enableFirebaseTelemetry();

export default ai;
