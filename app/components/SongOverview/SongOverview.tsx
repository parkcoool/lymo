import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import * as S from "./SongOverview.styles";

interface SongOverviewProps {
  title: string;
  artist: string;
  album: string;
  createdAt: string;
  coverUrl: string | null;
  description: string | null;
  coverElementRef?: React.Ref<HTMLImageElement>;
}

export default function SongOverview({
  title,
  artist,
  album,
  createdAt,
  coverUrl,
  description,
  coverElementRef,
}: SongOverviewProps) {
  const [showAll, setShowAll] = useState(false);
  const overviewRef = useRef<HTMLParagraphElement>(null);

  const handleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // 설명이 넘치는지 감지
  const [isOverflowing, setIsOverflowing] = useState(true);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (overviewRef.current) {
        setIsOverflowing(overviewRef.current.scrollHeight > 96);
      }
    });

    if (overviewRef.current) observer.observe(overviewRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <S.Wrapper>
      {/* 노래 정보 */}
      <S.SongInfo>
        <S.Cover
          src={coverUrl ?? ""}
          crossOrigin="anonymous"
          ref={coverElementRef}
        />
        <S.SongInfoRight>
          <S.Title>{title}</S.Title>
          <S.Description>{`${artist} • ${album} • ${createdAt}`}</S.Description>
        </S.SongInfoRight>
      </S.SongInfo>

      {/* 설명 */}
      <S.OverviewWrapper $showAll={!isOverflowing || showAll}>
        <S.Overview ref={overviewRef}>{description}</S.Overview>
      </S.OverviewWrapper>
      {isOverflowing && (
        <S.ShowAllButton onClick={handleShowAll}>
          <S.ArrowDropDownIconWrapper>
            <MdArrowDropDown />
          </S.ArrowDropDownIconWrapper>
          {showAll ? "간략히 보기" : "자세히 보기"}
        </S.ShowAllButton>
      )}

      {/* 배경 */}
      <S.Background src={coverUrl ?? ""} />
    </S.Wrapper>
  );
}
