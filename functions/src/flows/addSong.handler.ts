import { onCallGenkit } from "firebase-functions/https";

import googleAIapiKey from "../core/secret";
import { addSongFlow } from "./addSong.flow";

const addSong = onCallGenkit(
  {
    authPolicy: (auth) => auth?.token?.email_verified ?? false,
    secrets: [googleAIapiKey],
    region: "asia-northeast3",
  },
  addSongFlow
);

export default addSong;
