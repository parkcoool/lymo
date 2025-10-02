import { tracks } from "@lymo/schemas/database";
import { WithId } from "@/types/shared";

export type TrackDocument = tracks.TrackDoc;

export type TrackDocumentWithId = WithId<TrackDocument>;
