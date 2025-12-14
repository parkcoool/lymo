import { useMutation } from "@tanstack/react-query";

import increaseStoryView from "../apis/increaseStoryView";

export default function useIncreaseStoryViewMutation() {
  return useMutation({
    mutationKey: ["increase-story-view"],
    mutationFn: async (storyId: string) => {
      if (!storyId) return;
      await increaseStoryView(storyId);
    },
  });
}
