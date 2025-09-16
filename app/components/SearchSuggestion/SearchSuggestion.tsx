import { useMemo } from "react";
import { MdDelete, MdSearch } from "react-icons/md";

import IconButton from "../IconButton";

import * as S from "./SearchSuggestion.styles";

interface SearchSuggestionProps {
  suggestion: string;
  query: string;
  onDelete: () => void;
  onSearch: () => void;
}

export default function SearchSuggestion({
  suggestion,
  query,
  onDelete,
  onSearch,
}: SearchSuggestionProps) {
  const textContent = useMemo(() => {
    if (!query) return suggestion;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = suggestion.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <S.HighlightedText key={index}>{part}</S.HighlightedText>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  }, [suggestion, query]);

  return (
    <S.Wrapper>
      <S.Left>
        <S.SearchIconWrapper>
          <MdSearch />
        </S.SearchIconWrapper>
        <S.Text>{textContent}</S.Text>
      </S.Left>
      <S.Right>
        <IconButton onClick={onDelete}>
          <S.ActionIconWrapper>
            <MdDelete />
          </S.ActionIconWrapper>
        </IconButton>
        <IconButton onClick={onSearch}>
          <S.ActionIconWrapper>
            <MdSearch />
          </S.ActionIconWrapper>
        </IconButton>
      </S.Right>
    </S.Wrapper>
  );
}
