import { MdClose, MdReport } from "react-icons/md";

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
  return (
    <S.Container $isActive={isActive}>
      <S.SetenceContainer>{children}</S.SetenceContainer>
      {summary && (
        <S.SummaryWrapper>
          <S.Summary>{summary}</S.Summary>
          {onReport && (
            <S.SummaryFooter>
              <S.SummaryActionIconWrapper>
                <MdReport />
              </S.SummaryActionIconWrapper>
              <S.SummaryActionIconWrapper>
                <MdClose />
              </S.SummaryActionIconWrapper>
            </S.SummaryFooter>
          )}
        </S.SummaryWrapper>
      )}
    </S.Container>
  );
}
