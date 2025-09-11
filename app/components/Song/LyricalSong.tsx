import { useRef } from "react";
import { MdPlayCircle } from "react-icons/md";
import { useNavigate } from "react-router";
import { useTheme } from "styled-components";

import useCoverColor from "~/hooks/useCoverColor";

import IconButton from "../IconButton";

import * as S from "./LyricalSong.styles";

interface LyricalSongProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  lyrics: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function LyricalSong({
  id,
  title,
  artist,
  coverUrl,
  lyrics,
  ...props
}: LyricalSongProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  // 커버 대표 색상
  const coverElementRef = useRef<HTMLImageElement>(null);
  const coverColor = useCoverColor(coverElementRef, id);

  const handleClick = () => {
    navigate(`/player/${id}`);
  };

  return (
    <S.Wrapper $coverColor={coverColor ?? theme.colors.background} {...props}>
      <S.Info>
        <S.Cover
          crossOrigin="anonymous"
          src={coverUrl ?? ""}
          ref={coverElementRef}
        />
        <S.InfoText>
          <S.Title>{title}</S.Title>
          <S.Artist>{artist}</S.Artist>
        </S.InfoText>
      </S.Info>
      <S.Lyrics>
        <S.SeteneceContainer>
          {lyrics
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => (
              <li key={line}>
                <p>{line}</p>
              </li>
            ))}
        </S.SeteneceContainer>
      </S.Lyrics>
      <S.Footer>
        <IconButton
          onClick={handleClick}
          aria-label={`${title} 재생하기`}
          title={`${title} 재생하기`}
        >
          <S.PlayCircleIconWrapper>
            <MdPlayCircle />
          </S.PlayCircleIconWrapper>
        </IconButton>
      </S.Footer>
    </S.Wrapper>
  );
}
