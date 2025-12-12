import { z } from "zod";

import {
  BaseStoryFieldsSchema as OriginalBaseStoryFieldsSchema,
  GeneratedStoryFieldsSchema as OriginalGeneratedStoryFieldsSchema,
} from "./doc";
import { errorCode } from "./error";
import { LanguageSchema } from "./shared";

// ==============================
// storyRequest 관련 스키마
// ==============================

export const BaseStoryFieldsSchema = OriginalBaseStoryFieldsSchema.extend({
  userAvatar: OriginalBaseStoryFieldsSchema.shape.userAvatar.optional(),
});

export const GeneratedStoryFieldsSchema = OriginalGeneratedStoryFieldsSchema.extend({
  sectionNotes: z.union([z.record(z.coerce.number(), z.string()), z.array(z.string().nullable())]),
  lyricTranslations: z.union([
    z.record(z.coerce.number(), z.string()),
    z.array(z.string().nullable()),
  ]),
});

// `storyRequests/{storyRequestId}` 문서 스키마
export const StoryRequestSchema = z.union([
  // status가 PENDING일 경우
  z.union([
    z.object({
      status: z.literal("PENDING"),
      language: LanguageSchema,
      trackId: z.string(),
    }),

    z.object({
      status: z.literal("PENDING"),
      language: LanguageSchema,
      title: z.string(),
      artist: z.string(),
      durationInSeconds: z.number(),
    }),
  ]),

  // status가 IN_PROGRESS일 경우
  BaseStoryFieldsSchema.merge(GeneratedStoryFieldsSchema.partial()).extend({
    status: z.literal("IN_PROGRESS"),
  }),

  // status가 COMPLETED일 경우
  BaseStoryFieldsSchema.merge(GeneratedStoryFieldsSchema.partial()).extend({
    status: z.literal("COMPLETED"),
  }),

  // status가 FAILED일 경우
  z.object({
    status: z.literal("FAILED"),
    errorCode: errorCode,
  }),
]);
export type StoryRequest = z.infer<typeof StoryRequestSchema>;
