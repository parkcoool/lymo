import { Lyric } from "@lymo/schemas/shared";

export interface Section {
  lyrics: (Lyric & { translation?: string | null })[];
  note: string | null;
}
