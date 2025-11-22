import { onCallGenkit } from "firebase-functions/v2/https";

import { getTrackFromMetadataFlow } from "./getTrackFromMetadata.flow";

const getTrackFromMetadata = onCallGenkit(
  {
    cors: true,
    timeoutSeconds: 300,
    region: "asia-northeast3",
  },
  getTrackFromMetadataFlow
);

export default getTrackFromMetadata;
