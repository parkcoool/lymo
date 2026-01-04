import { z } from "genkit";

export const InputSchema = z.object({
  lyrics: z
    .array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
    )
    .describe("The lyrics of the song"),
});

export const OutputSchema = z.array(z.number().describe("An index where paragraphs should break"));
