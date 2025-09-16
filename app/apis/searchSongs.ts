import { algoliaClient } from "~/core/algolia";
import type { SongDocument } from "~/types/song";

interface SearchSongsProps {
  query: string;
}

export default async function searchSongs({ query }: SearchSongsProps) {
  if (!query) return [];

  const response = await algoliaClient.searchSingleIndex<SongDocument>({
    indexName: "song",
    searchParams: {
      query,
      length: 20,
    },
  });

  return response.hits;
}
