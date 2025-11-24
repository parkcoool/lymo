import z from "zod";

export const errorCode = z.enum(["TRACK_SEARCH_NOT_FOUND", "TRACK_NOT_FOUND"]);
export type ErrorCode = z.infer<typeof errorCode>;
