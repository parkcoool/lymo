import { onCallGenkit } from "firebase-functions/v2/https";

import { inferSongMetadataFlow } from "./inferSongMetadata.flow";

const inferSongMetadata = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    region: "asia-northeast3",
  },
  inferSongMetadataFlow
);

export default inferSongMetadata;
