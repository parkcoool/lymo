import { useState } from "react";
import { MdChevronLeft, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router";

import IconButton from "~/components/IconButton";
import SearchHistory from "~/components/SearchHistory/SearchHistory";
import { useSearchHistoryStore } from "~/contexts/useSearchHistoryStore";

import * as S from "./Search.styles";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { histories, deleteHistory, addHistory } = useSearchHistoryStore();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (query: string) => {
    addHistory(query);
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <S.SearchBox>
        <IconButton onClick={handleBackButtonClick}>
          <S.LeftIconWrapper>
            <MdChevronLeft />
          </S.LeftIconWrapper>
        </IconButton>
        <S.SearchInput>
          <S.TextInput
            placeholder="음악 검색"
            autoFocus
            value={query}
            onChange={handleInputChange}
          />
          <IconButton onClick={() => handleSearch(query)}>
            <S.SearchIconWrapper>
              <MdSearch />
            </S.SearchIconWrapper>
          </IconButton>
        </S.SearchInput>
      </S.SearchBox>

      <S.SugggestionContainer>
        {/* 쿼리가 빈 문자열이면 검색 기록 표시 */}
        {query.length === 0 &&
          histories.map((history) => (
            <SearchHistory
              key={history}
              history={history}
              onDelete={() => deleteHistory(history)}
              onSearch={() => handleSearch(history)}
            />
          ))}

        {/* 쿼리가 빈 문자열이 아니면 */}
        {query.length > 0 &&
          histories.map((history) => (
            <SearchHistory
              key={history}
              history={history}
              query={query}
              onDelete={() => deleteHistory(history)}
              onSearch={() => handleSearch(history)}
              showOnlyWhenHighlighted
            />
          ))}
      </S.SugggestionContainer>
    </>
  );
}
