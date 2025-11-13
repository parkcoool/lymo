import type {
  GenerateDetailFlowInput,
  GenerateDetailFlowStream,
  GenerateDetailFlowOutput,
} from "@lymo/schemas/function";
import { streamFlow } from "genkit/beta/client";

const generateDetail = (input: GenerateDetailFlowInput) =>
  streamFlow<GenerateDetailFlowOutput, GenerateDetailFlowStream>({
    url: "/generateDetail",
    input,
  });

export default generateDetail;
