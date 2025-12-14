import { useEffect, useRef } from "react";

import useIncreaseViewsMutation from "@/entities/player/hooks/useIncreaseViewsMutation";

interface UseIncreaseViewsParams {
  storyId?: string;
  trackId?: string;
}

export default function useIncreaseViews({ storyId, trackId }: UseIncreaseViewsParams) {
  const { mutate: increaseViews } = useIncreaseViewsMutation();

  const done = useRef(false);

  useEffect(() => {
    if (storyId && !done.current) {
      increaseViews({ storyId, trackId });
      done.current = true;
    }
  }, [storyId, trackId, increaseViews]);
}
