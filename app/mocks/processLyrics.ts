import type { LyricsParagraph, LyricsSentence } from "~/types/song";

/**
 * 타임스탬프 문자열([mm:ss.xx])을 밀리초(ms) 단위의 숫자로 변환합니다.
 * @param timeString - [mm:ss.xx] 형식의 타임스탬프 문자열
 * @returns 변환된 밀리초(ms)
 */
function parseTimestamp(timeString: string): number | null {
  const match = timeString.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
  if (!match) {
    return null;
  }
  const [, minutes, seconds, millisecondsPart] = match;
  // 밀리초 부분이 2자리(센티초)이면 10을 곱하고, 3자리이면 그대로 사용합니다.
  const milliseconds =
    millisecondsPart.length === 2
      ? parseInt(millisecondsPart, 10) * 10
      : parseInt(millisecondsPart, 10);

  return (
    parseInt(minutes, 10) * 60 * 1000 +
    parseInt(seconds, 10) * 1000 +
    milliseconds
  );
}

/**
 * 평문 가사(plainLyrics)와 시간 정보가 포함된 가사(syncedLyrics)를 병합하여
 * 구조화된 가사 데이터 형식으로 변환합니다.
 *
 * @param plainLyrics - 줄바꿈 문자(\n\n)로 문단이 구분된 평문 가사
 * @param syncedLyrics - 각 줄에 타임스탬프가 포함된 가사
 * @returns 변환된 `Result` 타입의 가사 데이터
 */
export default function processLyrics(
  plainLyrics: string,
  syncedLyrics: string
): LyricsParagraph[] {
  // 1. syncedLyrics를 파싱하여 타임스탬프와 가사 텍스트로 분리된 객체 배열을 생성합니다.
  const timedSentencesRaw = syncedLyrics
    .trim()
    .split("\n")
    .map((line) => {
      const timestamp = parseTimestamp(line);
      if (timestamp === null) {
        return null;
      }
      const text = line.replace(/\[.*?\]/, "").trim();
      return { timestamp, text };
    })
    .filter(
      (item): item is { timestamp: number; text: string } =>
        item !== null && item.text !== ""
    );

  // 2. start, end 시간을 포함하는 LyricsSentence 배열을 생성합니다.
  const fullSentences: LyricsSentence[] = timedSentencesRaw.map(
    (current, index) => {
      const next = timedSentencesRaw[index + 1];
      // 다음 문장이 있으면 그 문장의 시작 시간을 현재 문장의 종료 시간으로 설정합니다.
      // 마지막 문장일 경우, 시작 시간으로부터 5초 뒤를 종료 시간으로 설정합니다.
      const endTime = next ? next.timestamp : current.timestamp + 5000;

      return {
        text: current.text,
        translation: null, // 요구사항에 따라 기본값은 null로 설정
        start: current.timestamp,
        end: endTime,
      };
    }
  );

  // 3. plainLyrics를 파싱하여 문단별로 가사 줄을 나눈 2차원 배열을 생성합니다.
  const plainParagraphs = plainLyrics
    .trim()
    .split("\n\n")
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    );

  const result: LyricsParagraph[] = [];
  let sentenceIndex = 0;

  // 4. 평문 가사 문단을 기준으로 fullSentences 배열에서 문장을 가져와 최종 구조를 만듭니다.
  for (const paragraphLines of plainParagraphs) {
    const paragraphSentenceCount = paragraphLines.length;
    const sentencesForParagraph = fullSentences.slice(
      sentenceIndex,
      sentenceIndex + paragraphSentenceCount
    );

    if (sentencesForParagraph.length > 0) {
      const newParagraph: LyricsParagraph = {
        sentences: sentencesForParagraph,
        description: null, // 요구사항에 따라 기본값은 null로 설정
      };
      result.push(newParagraph);
    }

    sentenceIndex += paragraphSentenceCount;
  }

  return result;
}
