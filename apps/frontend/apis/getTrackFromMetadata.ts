import type {
  GetTrackFromMetadataFlowInput,
  GetTrackFromMetadataFlowStream,
  GetTrackFromMetadataFlowOutput,
} from "@lymo/schemas/function";

import { streamFlow } from "@/utils/streamFlow";

const getTrackFromMetadata = (input: GetTrackFromMetadataFlowInput) =>
  streamFlow<GetTrackFromMetadataFlowOutput, GetTrackFromMetadataFlowStream>({
    url: "https://gettrackfrommetadata-au5g5tbwtq-du.a.run.app",
    input,
  });

export default getTrackFromMetadata;
