import { Genkit, genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { defineSecret } from "firebase-functions/params";
import { onInit } from "firebase-functions";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

let ai: Genkit = genkit({
  model: "googleai/gemini-2.5-flash",
  plugins: [googleAI()],
});

onInit(() => {
  ai = genkit({
    model: "googleai/gemini-2.5-flash",
    plugins: [googleAI({ apiKey: geminiApiKey.value() })],
  });
});

export default ai;
