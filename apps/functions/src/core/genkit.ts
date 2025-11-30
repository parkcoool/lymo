import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const ai = genkit({ plugins: [googleAI()] });

export default ai;
