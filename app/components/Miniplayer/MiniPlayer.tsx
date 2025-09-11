import { useMemo, useRef } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { useTheme } from "styled-components";

import useCoverColor from "~/hooks/useCoverColor";
import darkenHexColor from "~/utils/darkenHexColor";

import * as S from "./MiniPlayer.styles";

interface MiniPlayerProps {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function MiniPlayer({
  id,
  coverUrl,
  title,
  artist,
  isPlaying,
  onPlayPause,
}: MiniPlayerProps) {
  const theme = useTheme();

  // 커버 대표 색상
  const coverElementRef = useRef<HTMLImageElement>(null);
  const coverColor = useCoverColor(coverElementRef, id);
  const backgroundColor = useMemo(
    () =>
      coverColor ? darkenHexColor(coverColor, 70) : theme.colors.background,
    [coverColor]
  );

  return (
    <S.Wrapper $coverColor={backgroundColor}>
      <S.Left>
        <S.Cover ref={coverElementRef} src={coverUrl} alt={title} />
        <S.Info>
          <S.Title>{title}</S.Title>
          <S.Artist>{artist}</S.Artist>
        </S.Info>
      </S.Left>
      <S.Right>
        <S.ActionIconWrapper>
          {isPlaying ? <MdPause /> : <MdPlayArrow />}
        </S.ActionIconWrapper>
      </S.Right>
    </S.Wrapper>
  );
}
