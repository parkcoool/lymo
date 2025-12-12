import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const ai = genkit({ plugins: [googleAI()] });
enableFirebaseTelemetry();

export default ai;
