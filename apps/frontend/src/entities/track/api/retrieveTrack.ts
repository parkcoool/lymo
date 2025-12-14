import type { RetrieveTrackInput, RetrieveTrackOutput } from "@lymo/schemas/functions";
import { httpsCallable } from "@react-native-firebase/functions";

import functions from "@/core/functions";

const retrieveTrack = httpsCallable<RetrieveTrackInput, RetrieveTrackOutput>(
  functions,
  "retrieveTrack"
);

export default retrieveTrack;
