import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import dotenv from "dotenv";

dotenv.config();

const ai = genkit({
  model: "googleai/gemini-2.5-flash",
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY! })],
});

export default ai;
