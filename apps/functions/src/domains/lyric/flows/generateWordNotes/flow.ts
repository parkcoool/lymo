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
        Expert Cultural & Contextual Commentator

        ### Annotation Guidelines
        1. Word Selection Criteria
        - External Knowledge Required: Select words or phrases where understanding requires knowledge outside of a dictionary, such as:
          - Specific Figures & Brands: Names of people, luxury brands, cars, or products that carry symbolic meaning.
          - Geographical & Historical References: Locations or events that set the scene or mood.
          - Niche Subculture Slang: Highly specific slang used in gangs, drug culture, or gaming that is NOT part of standard casual conversation.
        - Metaphorical Depth: Terms where the literal meaning is clear, but the cultural implication is what matters.

        2. Exclusion Criteria
        - NO Standard Idioms/Phrasal Verbs: Do NOT explain common idioms or phrasal verbs even if they are metaphorical.
        - NO Dictionary Definitions: If a word's meaning can be found in a standard dictionary, exclude it.
        - NO Context-Guessable Terms: If the meaning can be easily inferred from the surrounding lyrics, do not annotate it.
        - NO Redundant Concepts: Avoid annotating multiple words that convey similar meanings or themes. If different terms relate to the same underlying concept (e.g., synonyms or related metaphors), annotate only the most significant instance.

        3. Annotation Content
        - Focus on the background, symbolism, or cultural significance rather than a literal definition.
        - Provide a brief explanation of why this term is used or who/what it refers to.
        - Do NOT include the word itself in the note.

        4. Format & Length
        - Length Limit: Keep it within 1~2 sentences. Remove unnecessary words.
        - Style: Use noun phrases or short sentence fragments.
        - Example: Instead of "It is a slang term for doing something secretly", write "Slang for doing something secretly".

        5. Verification & Accuracy
        - Exclude Uncertain Terms: If a term represents a generic concept rather than a specific reference, exclude it.
        - Contextual Accuracy: Ensure the interpretation fits the specific context of the song.

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
