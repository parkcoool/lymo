import { z } from "zod";

import { LanguageSchema } from "./shared";

// `generateStory` 함수 입출력 스키마
export const generateStoryIO = {
  input: z.union([
    z.object({
      language: LanguageSchema,

      trackId: z.string(),
    }),

    z.object({
      language: LanguageSchema,

      title: z.string(),
      artist: z.string().optional(),
      durationInSeconds: z.number().optional(),
    }),
  ]),

  output: z.object({ ready: z.boolean() }),
};
export type GenerateStoryIO = InferSchemaRecord<typeof generateStoryIO>;

type InferSchemaRecord<T> = {
  [K in keyof T]: T[K] extends z.ZodTypeAny ? z.infer<T[K]> : never;
};
