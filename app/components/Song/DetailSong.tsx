import { MdPlayCircle } from "react-icons/md";

import convertSecondsToString from "~/utils/convertSecondsToString";

import * as S from "./DetailSong.styles";

interface DetailSongProps {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string | null;
}

export default function NormalSong({
  id,
  title,
  artist,
  duration,
  coverUrl,
}: DetailSongProps) {
  const handleClick = () => {
    // TODO: Implement song click functionality
  };

  return (
    <S.Wrapper aria-label={title} title={title} onClick={handleClick}>
      <S.Left>
        <S.Cover coverUrl={coverUrl ?? ""} />
        <S.Info>
          <S.Title>{title}</S.Title>
          <S.Description>{`${artist} ㆍ ${convertSecondsToString(duration)}`}</S.Description>
        </S.Info>
      </S.Left>
      <S.PlayCircleIconWrapper>
        <MdPlayCircle />
      </S.PlayCircleIconWrapper>
    </S.Wrapper>
  );
}
