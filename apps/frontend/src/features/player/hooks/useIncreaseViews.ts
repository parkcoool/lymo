import { useEffect, useRef } from "react";

import useIncreaseStoryViewMutation from "@/entities/story/hooks/useIncreaseStoryViewMutation";
import useIncreaseTrackViewMutation from "@/entities/track/hooks/useIncreaseTrackViewMutation";

interface UseIncreaseViewsParams {
  storyId?: string;
  trackId?: string;
}

export default function useIncreaseViews({ storyId, trackId }: UseIncreaseViewsParams) {
  const { mutate: increaseTrackView } = useIncreaseTrackViewMutation();
  const { mutate: increaseStoryView } = useIncreaseStoryViewMutation();

  const increasedTrackView = useRef(false);
  const increasedStoryView = useRef(false);

  useEffect(() => {
    if (trackId && !increasedTrackView.current) {
      increaseTrackView(trackId);
      increasedTrackView.current = true;
    }

    if (storyId && !increasedStoryView.current) {
      increaseStoryView(storyId);
      increasedStoryView.current = true;
    }
  }, [trackId, storyId, increaseTrackView, increaseStoryView]);
}
