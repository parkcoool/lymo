import { useMutation } from "@tanstack/react-query";

import increaseStoryView from "../apis/increaseStoryView";

export default function useIncreaseStoryViewMutation(storyId: string) {
  return useMutation({
    mutationKey: ["increase-story-view", storyId],
    mutationFn: async () => {
      await increaseStoryView(storyId);
    },
  });
}
