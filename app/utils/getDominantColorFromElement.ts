import ColorThief from "colorthief";

// 이전에 만들었던 RGB to HEX 변환 함수
const rgbToHex = (rgb: [number, number, number]): string => {
  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

/**
 * 로드된 HTMLImageElement로부터 대표 색상을 추출합니다.
 * @param imageElement - 색상을 추출할 <img> 요소
 * @returns HEX 색상 코드 문자열을 담은 Promise
 */
export const getDominantColorFromElement = (
  imageElement: HTMLImageElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (imageElement.crossOrigin !== "anonymous") {
      reject(
        new Error('이미지 요소에 crossOrigin="anonymous" 속성이 필요합니다.')
      );
      return;
    }

    const colorThief = new ColorThief();

    const extractColor = () => {
      try {
        const dominantRgb = colorThief.getColor(imageElement);
        const dominantHex = rgbToHex(dominantRgb);
        resolve(dominantHex);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        reject(new Error("대표 색상을 추출하는 데 실패했습니다."));
      }
    };

    // 이미지가 이미 완전히 로드되었는지 확인
    if (imageElement.complete) {
      extractColor();
    } else {
      // 아직 로드 중이라면 load 이벤트 리스너를 추가
      imageElement.addEventListener("load", extractColor);
      imageElement.addEventListener("error", () => {
        reject(new Error("이미지를 불러오는 데 실패했습니다."));
      });
    }
  });
};
