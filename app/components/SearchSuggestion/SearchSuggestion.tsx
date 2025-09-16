import { MdSearch } from "react-icons/md";

import useHighlightedText from "~/hooks/useHighlightedText";

import IconButton from "../IconButton";

import * as S from "./SearchSuggestion.styles";

interface SearchSuggestionProps {
  suggestion: string;
  query: string;
  onSearch: () => void;
  showOnlyWhenHighlighted?: boolean;
}

export default function SearchSuggestion({
  suggestion,
  query,
  onSearch,
  showOnlyWhenHighlighted = false,
}: SearchSuggestionProps) {
  const [highlightedText, highlighted] = useHighlightedText(suggestion, query);

  if (showOnlyWhenHighlighted && !highlighted) {
    return null;
  }

  return (
    <S.Wrapper>
      <S.Left>
        <S.SearchIconWrapper>
          <MdSearch />
        </S.SearchIconWrapper>
        <S.Text>
          {highlightedText.map((part, index) =>
            part.highlight ? (
              <S.Mark key={index}>{part.text}</S.Mark>
            ) : (
              part.text
            )
          )}
        </S.Text>
      </S.Left>
      <S.Right>
        <IconButton onClick={onSearch}>
          <S.ActionIconWrapper>
            <MdSearch />
          </S.ActionIconWrapper>
        </IconButton>
      </S.Right>
    </S.Wrapper>
  );
}
