import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { summarizeParagraphFlow } from "./summarizeParagraph.flow";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const summarizeParagraph = onCallGenkit(
  {
    enforceAppCheck: true,
    secrets: [geminiApiKey],
    region: "asia-northeast3",
  },
  summarizeParagraphFlow
);

export default summarizeParagraph;
