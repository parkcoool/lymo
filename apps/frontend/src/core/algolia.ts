import { searchClient } from "@algolia/client-search";

export const algoliaClient = searchClient(
  process.env.EXPO_PUBLIC_ALGOLIA_ID!,
  process.env.EXPO_PUBLIC_ALGOLIA_API_KEY!
);
