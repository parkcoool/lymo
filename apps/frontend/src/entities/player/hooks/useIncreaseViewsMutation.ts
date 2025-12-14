import { useMutation } from "@tanstack/react-query";

import increaseViews from "../apis/increaseViews";

export default function useIncreaseViewsMutation() {
  return useMutation({
    mutationKey: ["increase-views"],
    mutationFn: async ({ storyId, trackId }: { storyId?: string; trackId?: string }) => {
      if (!storyId || !trackId) return;
      await increaseViews({ storyId, trackId });
    },
  });
}
