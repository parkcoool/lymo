import { useSuspenseQuery } from "@tanstack/react-query";

import getPopularTracks from "@/apis/getPopularTracks";

export default function usePopularTracksQuery() {
  const query = useSuspenseQuery({
    queryKey: ["popular-tracks"],
    queryFn: async () => getPopularTracks(),
  });

  return query;
}
