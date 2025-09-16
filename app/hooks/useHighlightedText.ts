import { useMemo } from "react";

/**
 * text와 query를 받아 일치하는 부분을 분리하고 하이라이트 여부를 포함하는 객체 배열을 반환하는 훅
 * @param text - 원본 텍스트 문자열
 * @param query - 공백으로 구분된, 하이라이트할 단어들의 문자열
 * @returns 분리된 텍스트 조각과 하이라이트 여부를 담은 객체 배열
 */
export default function useHighlightedText(text: string, query: string) {
  const highlightedParts = useMemo(() => {
    // 쿼리가 비어있거나 공백만 있다면, 전체 텍스트를 하이라이트 없이 반환합니다.
    if (!query.trim()) {
      return [{ text, highlight: false }];
    }

    // 쿼리를 공백 기준으로 단어들로 나누고, 빈 문자열은 제거합니다.
    const queryWords = query.trim().split(/\s+/).filter(Boolean);

    // 쿼리 단어가 없으면, 전체 텍스트를 하이라이트 없이 반환합니다.
    if (queryWords.length === 0) {
      return [{ text, highlight: false }];
    }

    // 나중에 단어가 쿼리에 포함되는지 빠르게 확인하기 위해 Set을 생성합니다.
    const queryWordsSet = new Set(queryWords);

    // 정규식에서 특수 문자로 취급될 수 있는 문자들을 이스케이프 처리합니다.
    const escapedQueryWords = queryWords.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    // 쿼리 단어들을 OR(|) 조건으로 묶어 정규식을 생성합니다.
    // 괄호'()'로 감싸 캡처 그룹으로 만들어야 split 시 일치하는 단어도 결과에 포함됩니다.
    const regex = new RegExp(`(${escapedQueryWords.join("|")})`, "g");

    // 정규식을 기준으로 텍스트를 분리합니다. 결과 배열에서 빈 문자열은 제거합니다.
    const parts = text.split(regex).filter(Boolean);

    // 각 텍스트 조각을 순회하며, 쿼리 단어 Set에 포함되는지 여부에 따라 highlight 속성을 결정합니다.
    return parts.map((part) => ({
      text: part,
      highlight: queryWordsSet.has(part),
    }));
  }, [text, query]); // text나 query가 변경될 때만 이 로직을 다시 실행합니다.

  return highlightedParts;
}
