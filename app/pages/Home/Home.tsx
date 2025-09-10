import { MdLyrics, MdTrendingUp } from "react-icons/md";

import LogoIcon from "~/assets/logo.svg?react";
import { CompactSong, LyricsSong } from "~/components/Song";

import * as S from "./Home.styles";

export default function Home() {
  return (
    <S.Container>
      {/* 검색 섹션 */}
      <S.SearchSection>
        <S.Brand>
          <S.LogoIconWrapper>
            <LogoIcon />
          </S.LogoIconWrapper>
          Lymo
        </S.Brand>
        <S.SearchBox>음악 검색</S.SearchBox>
      </S.SearchSection>

      {/* 인기 섹션 */}
      <S.Section>
        <S.SectionTitle>
          <S.SectionIconWrapper>
            <MdTrendingUp />
          </S.SectionIconWrapper>
          인기
        </S.SectionTitle>
        <S.SectionContent>
          <CompactSong
            id={"1"}
            title={"song title"}
            coverUrl={"https://placehold.co/200x200"}
          />
          <CompactSong
            id={"2"}
            title={"song title"}
            coverUrl={"https://placehold.co/200x200"}
          />
          <CompactSong
            id={"3"}
            title={"song title"}
            coverUrl={"https://placehold.co/200x200"}
          />
        </S.SectionContent>
      </S.Section>

      {/* 가사가 좋은 음악 섹션 */}
      <S.Section>
        <S.SectionTitle>
          <S.SectionIconWrapper>
            <MdLyrics />
          </S.SectionIconWrapper>
          가사가 좋은 음악
        </S.SectionTitle>
        <S.SectionContent>
          <LyricsSong
            id={"1"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
          <LyricsSong
            id={"2"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
          <LyricsSong
            id={"3"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
        </S.SectionContent>
      </S.Section>
    </S.Container>
  );
}
