import { AddTrackFlowInput, AddTrackFlowOutput } from "@lymo/schemas/function";
import { runFlow } from "genkit/beta/client";

const addTrack = (input: AddTrackFlowInput) =>
  runFlow<AddTrackFlowOutput>({
    url: "",
    input,
  });

export default addTrack;
