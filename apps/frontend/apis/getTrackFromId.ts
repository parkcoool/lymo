import type {
  GetTrackFromIdFlowInput,
  GetTrackFromIdFlowStream,
  GetTrackFromIdFlowOutput,
} from "@lymo/schemas/function";

import { streamFlow } from "@/utils/streamFlow";

const getTrackFromId = (input: GetTrackFromIdFlowInput) =>
  streamFlow<GetTrackFromIdFlowOutput, GetTrackFromIdFlowStream>({
    url: "https://gettrackfromid-au5g5tbwtq-du.a.run.app",
    input,
  });

export default getTrackFromId;
