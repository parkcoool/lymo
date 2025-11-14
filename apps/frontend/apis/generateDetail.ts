import type {
  GenerateDetailFlowInput,
  GenerateDetailFlowStream,
  GenerateDetailFlowOutput,
} from "@lymo/schemas/function";

import { streamFlow } from "@/utils/streamFlow";

const generateDetail = (input: GenerateDetailFlowInput) =>
  streamFlow<GenerateDetailFlowOutput, GenerateDetailFlowStream>({
    url: "https://generatedetail-au5g5tbwtq-du.a.run.app",
    input,
  });

export default generateDetail;
