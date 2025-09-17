import * as S from "./LyricsSentenceSkeleton.styles";

export default function LyricsSentenceSkeleton() {
  return (
    <S.Container>
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
    </S.Container>
  );
}
