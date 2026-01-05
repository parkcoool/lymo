export default function getHighlightColor(index: number) {
  const highlightColors = ["#FF6B6B", "#FF9F43", "#FECA57", "#1DD1A1", "#54A0FF", "#FF9FF3"];

  return highlightColors[index % highlightColors.length];
}
