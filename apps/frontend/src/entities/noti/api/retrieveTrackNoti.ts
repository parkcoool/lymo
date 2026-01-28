import type { RetrieveTrackNotiInput, RetrieveTrackNotiOutput } from "@lymo/schemas/functions";
import { httpsCallable } from "@react-native-firebase/functions";

import functions from "@/core/functions";

const retrieveTrackNoti = httpsCallable<RetrieveTrackNotiInput, RetrieveTrackNotiOutput>(
  functions,
  "retrieveTrackNoti"
);

export default retrieveTrackNoti;
