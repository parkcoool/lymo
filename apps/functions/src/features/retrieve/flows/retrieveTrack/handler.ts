import { onCallGenkit } from "firebase-functions/https";

import { retrieveTrack as retrieveTrackFlow } from "./flow";

export const retrieveTrack = onCallGenkit(retrieveTrackFlow);
