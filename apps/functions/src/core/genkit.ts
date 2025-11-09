import { googleAI } from "@genkit-ai/google-genai";
import { Genkit, genkit } from "genkit";

let ai: Genkit = genkit({
  model: "googleai/gemini-2.5-flash",
  plugins: [googleAI()],
});

export const initAi = (apiKey: string) => {
  ai = genkit({
    model: "googleai/gemini-2.5-flash",
    plugins: [googleAI({ apiKey })],
  });
};

export default ai;
