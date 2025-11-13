import type { AddTrackFlowInput, AddTrackFlowOutput } from "@lymo/schemas/function";
import { runFlow } from "genkit/beta/client";

const addTrack = (input: AddTrackFlowInput) =>
  runFlow<AddTrackFlowOutput>({
    url: "/addTrack",
    input,
  });

export default addTrack;
