import { useMutation } from "@tanstack/react-query";

import increaseTrackView from "../api/increaseTrackView";

export default function useIncreaseTrackViewMutation() {
  return useMutation({
    mutationKey: ["increase-track-view"],
    mutationFn: async (trackId: string) => {
      if (!trackId) return;
      await increaseTrackView(trackId);
    },
  });
}
