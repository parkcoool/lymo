import { z } from "zod";

// 가사 문장 스키마
export const LyricSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});
export type Lyric = z.infer<typeof LyricSchema>;

// 언어 스키마
export const LanguageSchema = z.enum(["en", "ko"]);
export type Language = z.infer<typeof LanguageSchema>;

// 가사 제공자 스키마
export const LyricsProviderSchema = z.enum(["lrclib", "none"]);
export type LyricsProvider = z.infer<typeof LyricsProviderSchema>;

// 해석 생성 상태
export const StoryGenerationStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
]);
export type StoryGenerationStatus = z.infer<typeof StoryGenerationStatusSchema>;

// 반응 이모지
export const ReactionEmojiSchema = z.enum([
  "🔥",
  "❤️",
  "😭",
  "🤘",
  "🤣",
  "👏",
  "🥺",
  "😍",
  "😎",
  "🤯",
  "💯",
  "💔",
  "🫶",
  "✨",
  "🌙",
  "🎉",
  "🥰",
  "💃",
  "🥀",
  "☁️",
  "🫢",
  "🤪",
  "👻",
  "🍷",
]);
export type ReactionEmoji = z.infer<typeof ReactionEmojiSchema>;

// 단어 해석 스키마
export const WordNoteSchema = z.object({
  lyricIndex: z.number(),
  word: z.string(),
  note: z.string(),
});
export type WordNote = z.infer<typeof WordNoteSchema>;
