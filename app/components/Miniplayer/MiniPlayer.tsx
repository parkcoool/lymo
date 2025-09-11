import { useMemo, useRef } from "react";
import { MdArrowDropUp, MdPause, MdPlayArrow } from "react-icons/md";
import { useTheme } from "styled-components";

import useCoverColor from "~/hooks/useCoverColor";
import darkenHexColor from "~/utils/darkenHexColor";

import IconButton from "../IconButton";

import * as S from "./MiniPlayer.styles";

interface MiniPlayerProps {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onExpand: () => void;
}

export default function MiniPlayer({
  id,
  coverUrl,
  title,
  artist,
  isPlaying,
  onPlayPause,
  onExpand,
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
        <IconButton onClick={onExpand} aria-label="펼치기" title="펼치기">
          <S.ActionIconWrapper>
            <MdArrowDropUp />
          </S.ActionIconWrapper>
        </IconButton>

        <IconButton
          onClick={onPlayPause}
          aria-label={isPlaying ? "일시정지" : "재생"}
          title={isPlaying ? "일시정지" : "재생"}
        >
          <S.ActionIconWrapper>
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </S.ActionIconWrapper>
        </IconButton>
      </S.Right>
    </S.Wrapper>
  );
}
