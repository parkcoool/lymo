import { MdChevronLeft, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router";

import IconButton from "~/components/IconButton";

import * as S from "./Search.styles";

export default function Home() {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <S.SearchBox>
      <IconButton onClick={handleBackButtonClick}>
        <S.LeftIconWrapper>
          <MdChevronLeft />
        </S.LeftIconWrapper>
      </IconButton>
      <S.SearchInput>
        <S.TextInput placeholder="음악 검색" autoFocus />
        <S.SearchIconWrapper>
          <MdSearch />
        </S.SearchIconWrapper>
      </S.SearchInput>
    </S.SearchBox>
  );
}
