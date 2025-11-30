import { useState, useRef, useEffect } from "react";

/**
 * 텍스트가 변경될 때 한 글자씩 타이핑되는 효과를 주는 훅입니다.
 * 기존 텍스트에 새로운 텍스트가 덧붙여지는 경우에만 타이핑 효과가 발생합니다.
 *
 * @param text 표시할 전체 텍스트
 * @param speed 타이핑 속도 (ms)
 * @returns 현재 타이핑 진행 중인 텍스트
 */
export const useTypingAnimation = (text?: string | null, speed: number = 10) => {
  const [displayedText, setDisplayedText] = useState(text || "");
  const currentTextRef = useRef(text || "");
  const targetTextRef = useRef(text || "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    targetTextRef.current = text || "";

    // 텍스트가 없으면 초기화
    if (!text) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      currentTextRef.current = "";
      setDisplayedText("");
      return;
    }

    const animate = () => {
      const current = currentTextRef.current;
      const target = targetTextRef.current;

      // 목표 텍스트에 도달했으면 종료
      if (current === target) {
        timeoutRef.current = null;
        return;
      }

      // 기존 텍스트가 목표 텍스트의 시작부분과 일치하면 (덧붙여지는 경우)
      if (target.startsWith(current)) {
        const nextChar = target[current.length];
        currentTextRef.current = current + nextChar;
        setDisplayedText(currentTextRef.current);
        timeoutRef.current = setTimeout(animate, speed);
      } else {
        // 텍스트가 완전히 바뀌었으면 바로 변경
        currentTextRef.current = target;
        setDisplayedText(target);
        timeoutRef.current = null;
      }
    };

    if (!timeoutRef.current) {
      animate();
    }
  }, [text, speed]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return displayedText;
};
