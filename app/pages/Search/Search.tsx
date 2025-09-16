import { useState } from "react";
import { MdChevronLeft, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router";

import IconButton from "~/components/IconButton";
import SearchHistory from "~/components/SearchHistory/SearchHistory";

import * as S from "./Search.styles";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
          <S.SearchIconWrapper>
            <MdSearch />
          </S.SearchIconWrapper>
        </S.SearchInput>
      </S.SearchBox>

      <S.SugggestionContainer>
        <SearchHistory
          history="이 문장은 검색어 예시입니다."
          query={query}
          onDelete={() => {}}
          onSearch={() => {}}
        />
        <SearchHistory
          history="가까운 듯 먼 그대여"
          query={query}
          onDelete={() => {}}
          onSearch={() => {}}
        />
      </S.SugggestionContainer>
    </>
  );
}
