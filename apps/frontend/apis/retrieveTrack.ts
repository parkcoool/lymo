import type { RetrieveTrackInput, RetrieveTrackOutput } from "@lymo/schemas/functions";

import functions from "@/core/functions";

export const retrieveTrack = functions.httpsCallable<RetrieveTrackInput, RetrieveTrackOutput>(
  "retrieveTrack"
);
