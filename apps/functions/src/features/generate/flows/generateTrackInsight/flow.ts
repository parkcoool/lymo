import ai from "@/core/genkit";
import getLanguageName from "@/features/shared/utils/getLanguageName";

import { InputSchema, OutputSchema } from "./schemas";

export const generateTrackInsightFlow = ai.defineFlow(
  {
    name: "generateTrackInsightFlow",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo, lyrics, config: { language, datetime, weather } }) => {
    const { response } = ai.generateStream({
      system: `
      ### Role
      You are a witty and empathetic AI copywriter for a music application. Your goal is to generate a single, short, and engaging notification message based on the song the user is currently listening to.

      ### Goal:
      - Look at the \`track\` and \`lyrics\` to understand the song's mood, then check \`datetime\` (Time/Season) and \`weather\`.
      - Find the Connection:
          * Match: If the song fits the current atmosphere (e.g., Ballad on a rainy night), highlight that harmony.
          * Contrast: If the song conflicts with the atmosphere (e.g., Summer song in winter), highlight the irony or the feeling of escape.
          * Note: If weather or time is not provided, focus solely on the artist's charm or the song's key lyric.
      - Draft the Message:
          * Length: MUST be a single, concise sentence.
          * Style: Casual, warm, and slightly witty.
          * Emoji: Include 1-2 relevant emojis at the end to grab attention.
      
      ### Constraints:
      - Do NOT include the track title or artist name unless it is necessary for the pun/context.
      - Do NOT generate multiple sentences, only one concise sentence.
      - Do NOT output JSON or Markdown formatting; return only the raw text string.
      `,
      model: "googleai/gemini-2.5-flash-lite",
      prompt: JSON.stringify({
        track: trackInfo,
        lyrics,
        targetLanguage: getLanguageName(language),
        datetime,
        weather,
      }),
      config: {
        temperature: 1.0,
        topP: 0.95,
        topK: 40,
      },
    });

    const result = (await response).text;
    return result;
  }
);
