// 값 계산 헬퍼
export const calculateNewValue = (value: number, direction: -1 | 1) => {
  if (direction === -1) {
    return Math.max(value - 100, -10000);
  } else {
    return Math.min(value + 100, 10000);
  }
};
