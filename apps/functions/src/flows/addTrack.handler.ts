import { onCallGenkit } from "firebase-functions/v2/https";

import { addTrackFlow } from "./addTrack.flow";

const addTrack = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
  },
  addTrackFlow
);

export default addTrack;
