import { useEffect, useRef } from "react";

import * as S from "./LyricsSentence.styles";

interface LyricsParagraphProps {
  sentence: string;
  translation: string | null;
  isActive?: boolean;
  onClick?: () => void;
}

export default function LyricsSentence({
  sentence,
  translation,
  isActive = false,
  onClick,
}: LyricsParagraphProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive) {
      const element = ref.current;
      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition +
        window.pageYOffset -
        Math.max(window.innerHeight / 2, 300);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [isActive]);

  return (
    <S.Wrapper ref={ref} onClick={onClick}>
      <S.Sentence $isActive={isActive}>{sentence}</S.Sentence>
      {translation && (
        <S.Translation $isActive={isActive}>{translation}</S.Translation>
      )}
    </S.Wrapper>
  );
}
