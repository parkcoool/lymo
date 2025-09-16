import { MdAdd, MdMusicNote, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router";

import * as S from "./AddSongDialog.styles";

export type AddSongDialogVariant = "normal" | "extended";

interface AddSongDialogProps {
  variant: AddSongDialogVariant;
  className?: string;
}

export default function AddSongDialog({
  variant,
  className,
}: AddSongDialogProps) {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/search", { replace: true });
  };

  const handleAddSong = () => {
    // TODO
  };

  return (
    <S.Wrapper className={className} $variant={variant}>
      <S.Header $variant={variant}>
        <S.Title $variant={variant}>
          <S.MusicNoteAddIconWrapper>
            <MdMusicNote />
          </S.MusicNoteAddIconWrapper>
          찾으시는 음악이 없나요?
        </S.Title>
        <S.Subtitle $variant={variant}>
          음악 이름과 아티스트명만 입력하시면 1분 안에 음악을 등록해드려요.
        </S.Subtitle>
      </S.Header>
      <S.ButtonContainer $variant={variant}>
        {variant === "extended" && (
          <S.Button onClick={handleSearch}>
            <S.ButtonIconWrapper>
              <MdSearch />
            </S.ButtonIconWrapper>
            다시 검색하기
          </S.Button>
        )}
        <S.Button onClick={handleAddSong}>
          <S.ButtonIconWrapper>
            <MdAdd />
          </S.ButtonIconWrapper>
          음악 등록하기
        </S.Button>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}
