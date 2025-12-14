import { useEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, View } from "react-native";

import Sentence from "@/entities/player/ui/Sentence";

import { styles } from "./styles";

export default function Preview() {
  const [activeId, setActiveId] = useState(0);
  const [lineLayouts, setLineLayouts] = useState<Record<number, { y: number; height: number }>>({});
  const translateY = useRef(new Animated.Value(0)).current;

  // 2초마다 활성 문장 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId((prevId) => (prevId + 1) % lyrics.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 활성 문장 변경 시 화면 상단으로 스크롤 애니메이션
  useEffect(() => {
    const layout = lineLayouts[activeId];
    if (!layout) return;

    // active 라인의 중앙을 정렬
    const anchor = 100; // 화면 상단 지점
    const target = anchor - (layout.y + layout.height / 2);
    Animated.timing(translateY, {
      toValue: target,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeId, lineLayouts, translateY]);

  // 라인 레이아웃 핸들러
  const handleLineLayout = (e: LayoutChangeEvent, id: number) => {
    const { y, height } = e.nativeEvent.layout;

    setLineLayouts((prev) => {
      if (prev[id] && prev[id].y === y && prev[id].height === height) return prev;
      return { ...prev, [id]: { y, height } };
    });
  };

  return (
    <View style={{ overflow: "hidden" }}>
      <Animated.View style={[styles.previewContainer, { transform: [{ translateY }] }]}>
        {lyrics.map(({ id, sentence, translation }) => (
          <View key={id} onLayout={(e) => handleLineLayout(e, id)}>
            <Sentence sentence={sentence} translation={translation} active={id === activeId} />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const lyrics = [
  { id: 0, sentence: "Hey, Jude", translation: "헤이, 주드" },
  { id: 1, sentence: "Don't make it bad", translation: "나쁘게 만들지 마" },
  {
    id: 2,
    sentence: "Take a sad song and make it better",
    translation: "슬픈 노래를 더 좋게 만들어",
  },
  {
    id: 3,
    sentence: "Remember to let her into your heart",
    translation: "그녀를 네 마음에 들이도록 기억해",
  },
  {
    id: 4,
    sentence: "Then you can start to make it better",
    translation: "그러면 더 좋게 만들 수 있어",
  },
  {
    id: 5,
    sentence: "Hey, Jude, don't be afraid",
    translation: "헤이, 주드, 두려워하지 마",
  },
  {
    id: 6,
    sentence: "You were made to go out and get her",
    translation: "넌 그녀를 만나러 가도록 태어났어",
  },
  {
    id: 7,
    sentence: "The minute you let her under your skin",
    translation: "네 피부 밑에 그녀를 들이는 순간",
  },
  {
    id: 8,
    sentence: "Then you begin to make it better",
    translation: "그러면 더 좋게 만들기 시작해",
  },
];
