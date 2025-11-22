import { onCallGenkit } from "firebase-functions/v2/https";

import { getTrackFromIdFlow } from "./getTrackFromId.flow";

const getTrackFromId = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
  },
  getTrackFromIdFlow
);

export default getTrackFromId;
