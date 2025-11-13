import type { AddTrackFlowInput, AddTrackFlowOutput } from "@lymo/schemas/function";
import { runFlow } from "genkit/beta/client";

const addTrack = (input: AddTrackFlowInput) =>
  runFlow<AddTrackFlowOutput>({
    url: "https://addtrack-au5g5tbwtq-du.a.run.app",
    input,
  });

export default addTrack;
