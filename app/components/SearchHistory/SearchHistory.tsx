import { MdDelete, MdHistory, MdSearch } from "react-icons/md";

import useHighlightedText from "~/hooks/useHighlightedText";

import IconButton from "../IconButton";

import * as S from "./SearchHistory.styles";

interface SearchHistoryProps {
  history: string;
  query?: string;
  onDelete: () => void;
  onSearch: () => void;
}

export default function SearchHistory({
  history,
  query,
  onDelete,
  onSearch,
}: SearchHistoryProps) {
  const highlightedText = useHighlightedText(history, query ?? "");

  return (
    <S.Wrapper>
      <S.Left>
        <S.HistoryIconWrapper>
          <MdHistory />
        </S.HistoryIconWrapper>
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
