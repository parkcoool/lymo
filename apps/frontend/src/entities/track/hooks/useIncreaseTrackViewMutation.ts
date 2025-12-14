import { useMutation } from "@tanstack/react-query";

import increaseTrackView from "../api/increaseTrackView";

export default function useIncreaseTrackViewMutation(trackId: string) {
  return useMutation({
    mutationKey: ["increase-track-view", trackId],
    mutationFn: async () => {
      await increaseTrackView(trackId);
    },
  });
}
