import { useEffect, useState } from "react";
import { View } from "react-native";

import Sentence from "@/components/player/Sentence";

import { styles } from "./NotificationAccessRequired.styles";

export default function Preview() {
  const [activeId, setActiveId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId((prevId) => (prevId + 1) % lyrics.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.previewContainer}>
      {lyrics.map(({ id, sentence, translation }) => (
        <Sentence key={id} sentence={sentence} translation={translation} active={id === activeId} />
      ))}
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
];
