export default function getHighlightColor(index: number) {
  const highlightColors = [
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#008000",
    "#0000FF",
    "#4B0082",
    "#EE82EE",
  ];

  return highlightColors[index % highlightColors.length];
}
