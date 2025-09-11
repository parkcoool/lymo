import * as S from "./LyricsSentence.styles";

interface LyricsParagraphProps {
  sentence: string;
  translation: string;
  isActive?: boolean;
}

export default function LyricsParagraph({
  sentence,
  translation,
  isActive = false,
}: LyricsParagraphProps) {
  return (
    <S.Wrapper>
      <S.Sentence $isActive={isActive}>{sentence}</S.Sentence>
      <S.Translation $isActive={isActive}>{translation}</S.Translation>
    </S.Wrapper>
  );
}
