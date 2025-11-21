import { onCallGenkit } from "firebase-functions/v2/https";

import { getTrackFromIdFlow } from "./getTrackFromId";

const getTrackFromId = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
  },
  getTrackFromIdFlow
);

export default getTrackFromId;
