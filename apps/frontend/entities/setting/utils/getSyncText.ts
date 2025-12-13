export default function getSyncText(syncDelay: number) {
  return syncDelay === 0
    ? ""
    : `${Math.abs(syncDelay / 1000)}초 ${syncDelay < 0 ? "느리게" : "빠르게"}`;
}
