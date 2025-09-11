import { useEffect, useMemo, useRef, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import * as S from "./SongOverview.styles";

interface SongOverviewProps {
  title?: string;
  artist?: string;
  album?: string | null;
  createdAt?: string;
  coverUrl?: string;
  description?: string | null;
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
  const overviewRef = useRef<HTMLDivElement>(null);

  const handleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // 발매 연도
  const year = useMemo(
    () => (createdAt ? new Date(createdAt).getFullYear() : undefined),
    [createdAt]
  );

  // 설명이 넘치는지 감지
  const [isOverflowing, setIsOverflowing] = useState(false);
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
        {coverUrl ? (
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
          {artist && album !== undefined && year ? (
            <S.Description>{`${artist} • ${album ? `${album} • ` : ""}${year}`}</S.Description>
          ) : (
            <S.DescriptionSkeleton />
          )}
        </S.SongInfoRight>
      </S.SongInfo>

      {/* 설명 */}
      {description !== null && (
        <S.OverviewWrapper $showAll={!isOverflowing || showAll}>
          <div ref={overviewRef}>
            {description ? (
              <S.Overview>{description}</S.Overview>
            ) : (
              <>
                <S.OverviewSkeleton />
                <S.OverviewSkeleton />
                <S.OverviewSkeleton />
              </>
            )}
          </div>
        </S.OverviewWrapper>
      )}

      {/* 자세히 보기 */}
      {description !== null && isOverflowing && (
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
