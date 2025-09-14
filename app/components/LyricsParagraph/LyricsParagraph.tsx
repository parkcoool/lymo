import { useState } from "react";
import { MdClose, MdReport } from "react-icons/md";

import IconButton from "../IconButton";

import * as S from "./LyricsParagraph.styles";

interface LyricsParagraphProps {
  isActive?: boolean;
  children: React.ReactNode;
  summary?: string;
  onReport?: () => void;
}

export default function LyricsParagraph({
  isActive = false,
  children,
  summary,
  onReport,
}: LyricsParagraphProps) {
  const [hide, setHide] = useState(false);

  const handleHide = () => setHide(true);

  return (
    <S.Container $isActive={isActive}>
      <S.SentenceContainer>{children}</S.SentenceContainer>
      {summary && !hide && (
        <S.SummaryWrapper>
          <S.Summary>{summary}</S.Summary>
          {onReport && (
            <S.SummaryFooter>
              <IconButton
                onClick={onReport}
                title="문제 신고"
                aria-label="문제 신고"
              >
                <S.SummaryActionIconWrapper>
                  <MdReport />
                </S.SummaryActionIconWrapper>
              </IconButton>
              <IconButton
                onClick={handleHide}
                title="설명 숨기기"
                aria-label="설명 숨기기"
              >
                <S.SummaryActionIconWrapper>
                  <MdClose />
                </S.SummaryActionIconWrapper>
              </IconButton>
            </S.SummaryFooter>
          )}
        </S.SummaryWrapper>
      )}
    </S.Container>
  );
}
