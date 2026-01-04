import { ai } from "@/config";
import getLanguageName from "@/shared/utils/getLanguageName";

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
      You are "Lymo", a knowledgeable music insider and storyteller.
      Generate a push notification that reveals a fascinating fact, backstory, or specific lyrical insight about the current song.
      The user should click the notification because they are curious to learn the full story behind the song.

      ### Core Instructions
      1. Identify the "Insight Hook"
      - Behind-the-scenes: Interesting anecdotes from the production or recording process.
      - Lyrical Irony/Depth: Hidden meanings that contradict the melody.
      - Historical Context: The era or situation when it was released.
      - If no specific trivia is known: Focus on a specific, unique element of the composition or a poetic interpretation of a key lyric.

      2. Blend the Context
      - \`datetime\` and \`weather\` are optionally provided to help you tailor the insight to the user's current environment.
      - Incorporate these details subtly to make the notification feel timely and relevant.

      3. Drafting the Message:
      - Style: Informative yet intriguing.
      - Constraint: STRICTLY a single, concise sentence.
      - Emoji: Optional. Use maximum one emoji only if necessary.

      ### Constraints
      - Do NOT reveal the full story; just tease it enough to spark curiosity.
      - Keep it under 100 characters.
      - The message must be in the specified target language.
      `,
      model: "googleai/gemini-2.5-flash",
      prompt: JSON.stringify({
        track: trackInfo,
        lyrics,
        targetLanguage: getLanguageName(language),
        datetime: datetime ?? new Date().toISOString(),
        weather: weather ?? "unknown",
      }),
    });

    const result = (await response).text;
    return result;
  }
);
