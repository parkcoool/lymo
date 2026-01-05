import { WordNote, WordNoteSchema } from "@lymo/schemas/shared";

import { ai } from "@/config";

import { InputSchema, OutputSchema } from "./schemas";

export const generateWordNotesFlow = ai.defineFlow(
  {
    name: "generateWordNotesFlow",
    inputSchema: InputSchema,
    streamSchema: OutputSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo: track, lyrics, config: { language } }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
        ### Role
        Expert Vocabulary Annotator

        ### Annotation Guidelines
        1. Word Selection Criteria
        - Select words or phrases that are likely to be unfamiliar to a general audience, including:
          - Obscure slang or idioms
          - Culturally specific references
          - Archaic or uncommon vocabulary
        - Avoid annotating common words or phrases that are easily understood in context.

        2. Annotation Content
        - Provide a brief definition or explanation of the selected word or phrase.
        - Include relevant cultural or contextual information that enhances understanding.
        - Do NOT include the word itself in the note.

        3. Format & Length
        - Length Limit: Keep it within 1~2 sentences. Remove unnecessary words to minimize length.
        - Style: Use noun phrases or short sentence fragments. Avoid full sentences if they add unnecessary length.
        - Example: Instead of "It is a slang term for doing something secretly", write "Slang for doing something secretly".

        4. Verification & Accuracy
        - Exclude Uncertain Terms: If a term's meaning is ambiguous, controversial, or cannot be definitively confirmed in the specific context of the lyrics, exclude it. Do not guess.
        - Contextual Accuracy: Ensure the interpretation fits the specific context of the song. Avoid generic or incorrect slang definitions that do not apply.

        ### Output Format
        - All annotations must be written in the given target language.
        - Output an array of objects, each containing:
          - \`lyricIndex\`: The index of the lyric line where the word appears.
          - \`word\`: The selected word or phrase, exactly as it appears in the lyrics.
          - \`note\`: The corresponding annotation.
        `,
      model: "googleai/gemini-2.5-flash",
      prompt: JSON.stringify({
        track,
        lyrics: lyrics.map((sentence, index) => `[${index}] ${sentence}`),
        targetLanguage: language,
      }),
      output: { schema: OutputSchema },
    });

    for await (const chunk of stream) {
      if (!chunk.output) continue;
      const filtered = filterWordNotes(chunk.output, lyrics);

      sendChunk(filtered);
    }

    const result = (await response).output;

    if (!result) return [];
    const filtered = filterWordNotes(result, lyrics);

    return filtered;
  }
);

const filterWordNotes = (wordNotes: WordNote[], lyrics: string[]) => {
  return wordNotes.filter((item) => {
    if (!WordNoteSchema.safeParse(item).success) return false;

    const lyric = lyrics[item.lyricIndex];
    if (!lyric) return false;

    const includes = lyric.toLowerCase().includes(item.word.toLowerCase());
    if (!includes) return false;

    return true;
  });
};
