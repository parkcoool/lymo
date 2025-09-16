import type { Route } from "./+types/SearchResult";
import * as S from "./SearchResult.styles";

export default function SearchResult({ params }: Route.LoaderArgs) {
  const query = params.query;

  return <S.Container>{query}</S.Container>;
}
