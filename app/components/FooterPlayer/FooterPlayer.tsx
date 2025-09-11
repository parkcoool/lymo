import { MdPause, MdPlayArrow } from "react-icons/md";

import IconButton from "../IconButton";

import * as S from "./FooterPlayer.styles";

interface FooterPlayerProps {
  coverUrl?: string;
  title?: string;
  artist?: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function FooterPlayer({
  coverUrl,
  title,
  artist,
  isPlaying,
  onPlayPause,
}: FooterPlayerProps) {
  return (
    <S.Wrapper>
      <S.Left>
        <S.Cover src={coverUrl} alt={title} />
        <S.Info>
          <S.Title>{title}</S.Title>
          <S.Artist>{artist}</S.Artist>
        </S.Info>
      </S.Left>
      <S.Right>
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
