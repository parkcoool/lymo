import { defineSecret } from "firebase-functions/params";
import { onCallGenkit } from "firebase-functions/v2/https";

import { summarizeParagraphFlow } from "./summarizeParagraph.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const summarizeParagraph = onCallGenkit(
  {
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  summarizeParagraphFlow
);

export default summarizeParagraph;
