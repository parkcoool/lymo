import { Track, TrackDetail } from "@lymo/schemas/shared";

export interface TrackStreamResult {
  duplicate: boolean;
  notFound: boolean;
  trackId?: string;
  track?: Track & TrackDetail;
}
