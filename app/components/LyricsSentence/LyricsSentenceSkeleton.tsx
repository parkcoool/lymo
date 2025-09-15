import * as S from "./LyricsSentenceSkeleton.styles";

export default function LyricsSentenceSkeleton() {
  return (
    <S.Wrapper>
      <S.SentenceSkeleton />
      <S.TranslationSkeleton />
      <S.SentenceSkeleton />
      <S.TranslationSkeleton />
      <S.SentenceSkeleton />
      <S.TranslationSkeleton />
      <S.SentenceSkeleton />
      <S.TranslationSkeleton />
      <S.SentenceSkeleton />
      <S.TranslationSkeleton />
    </S.Wrapper>
  );
}
