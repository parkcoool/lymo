import { searchClient } from "@algolia/client-search";

export const algoliaClient = searchClient(
  import.meta.env.VITE_ALGOLIA_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);
