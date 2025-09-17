import { useEffect, useMemo, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import * as S from "./SongSummary.styles";

interface SongOverviewProps {
  title?: string;
  artist?: string;
  album?: string | null;
  publishedAt?: string | null;
  coverUrl?: string | null;
  summary?: string | null;
  coverElementRef?: React.Ref<HTMLImageElement>;
}

export default function SongSummary({
  title,
  artist,
  album,
  publishedAt,
  coverUrl,
  summary,
  coverElementRef,
}: SongOverviewProps) {
  const [showAll, setShowAll] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);

  const handleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // 발매 연도
  const year = useMemo(
    () =>
      typeof publishedAt === "string"
        ? new Date(publishedAt).getFullYear()
        : publishedAt,
    [publishedAt]
  );

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
        {coverUrl !== undefined ? (
          <S.Cover
            src={coverUrl ?? ""}
            crossOrigin="anonymous"
            ref={coverElementRef}
          />
        ) : (
          <S.CoverSkeleton />
        )}
        <S.SongInfoRight>
          {title ? <S.Title>{title}</S.Title> : <S.TitleSkeleton />}
          {artist && album !== undefined && year !== undefined ? (
            <S.Description>{`${artist} • ${album ? `${album} • ` : ""}${year ?? ""}`}</S.Description>
          ) : (
            <S.DescriptionSkeleton />
          )}
        </S.SongInfoRight>
      </S.SongInfo>

      {/* 설명 */}
      {summary !== null && (
        <S.OverviewWrapper $showAll={!isOverflowing || showAll}>
          <S.OverviewContent ref={overviewRef}>
            {summary ? (
              <S.Overview>{summary}</S.Overview>
            ) : (
              <>
                <S.OverviewSkeleton />
                <S.OverviewSkeleton />
                <S.OverviewSkeleton />
              </>
            )}
          </S.OverviewContent>
        </S.OverviewWrapper>
      )}

      {/* 자세히 보기 */}
      {summary !== null && isOverflowing && (
        <S.ShowAllButton onClick={handleShowAll}>
          <S.ArrowDropDownIconWrapper>
            <MdArrowDropDown />
          </S.ArrowDropDownIconWrapper>
          {showAll ? "간략히 보기" : "자세히 보기"}
        </S.ShowAllButton>
      )}
    </S.Wrapper>
  );
}
