export const calculateNewValue = (value: number, direction: -1 | 1) => {
  if (direction === -1) {
    return Math.max(value - 100, -10000);
  } else {
    return Math.min(value + 100, 10000);
  }
};

export const getSyncText = (syncDelay: number) =>
  syncDelay === 0 ? "" : `${Math.abs(syncDelay / 1000)}초 ${syncDelay < 0 ? "느리게" : "빠르게"}`;
