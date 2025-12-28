import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Logo from "@/shared/components/Logo";
import { colors } from "@/shared/constants/colors";

import { styles } from "./styles";

const ANIMATION_DURATION = 300;
const ANIMATION_DELAY = 2000;

const ITEMS = [
  {
    id: 1,
    offset: 0,
    title: "Hey Jude",
    content: "이 곡은 폴 매카트니가 존 레논의 아들을 위로하기 위해 만든 노래예요.",
  },
  {
    id: 2,
    offset: 1,
    title: "Bohemian Rhapsody",
    content: "6분이 넘는 곡으로, 라디오에서 자주 잘리지 않고 재생된 최초의 록 곡 중 하나예요. 🎸",
  },
  {
    id: 3,
    offset: 2,
    title: "Imagine",
    content:
      "이 곡은 전 세계적으로 평화와 희망의 상징으로 여겨지며, 수많은 자선 행사에서 불려졌어요. 🕊️",
  },
  {
    id: 4,
    offset: 3,
    title: "Billie Jean",
    content:
      "이 곡의 뮤직비디오는 MTV에서 아프리카계 미국인 아티스트로서 최초로 방영된 뮤직비디오예요.",
  },
];

export default function Body() {
  const progress = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      progress.value = withTiming(progress.value + 1, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.quad),
      });
    }, ANIMATION_DELAY);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <View style={styles.body}>
      {ITEMS.map((item) => (
        <Notification key={item.id} {...item} progress={progress} />
      ))}
    </View>
  );
}

function Notification({
  title,
  content,
  offset,
  progress,
}: {
  title: string;
  content: string;
  offset: number;
  progress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const adj = progress.value + offset;
    const currentPhase = Math.floor(adj) % 4;
    const nextPhase = (currentPhase + 1) % 4;
    const fraction = adj % 1;

    const states = {
      0: { opacity: 0, scale: 0.5, y: 0, z: 4 },
      1: { opacity: 1, scale: 1, y: 0, z: 3 },
      2: { opacity: 0.5, scale: 0.9, y: 15, z: 2 },
      3: { opacity: 0.2, scale: 0.8, y: 30, z: 1 },
    };

    const startState = states[currentPhase as keyof typeof states];
    let endState = states[nextPhase as keyof typeof states];

    if (currentPhase === 3) {
      endState = { opacity: 0, scale: 0.5, y: 45, z: 0 };
    }

    const opacity = startState.opacity + (endState.opacity - startState.opacity) * fraction;
    const scale = startState.scale + (endState.scale - startState.scale) * fraction;
    const translateY = startState.y + (endState.y - startState.y) * fraction;
    const zIndex = startState.z;

    return {
      opacity,
      transform: [{ translateY }, { scale }],
      zIndex,
      position: "absolute",
      width: "100%",
    };
  });

  return (
    <Animated.View style={[styles.notification, animatedStyle]}>
      <View style={styles.notificationTop}>
        <Logo width="16" height="16" color={colors.onSurfaceSubtle} />
        <Text style={styles.notificationSource}>Lymo</Text>
      </View>

      <View style={styles.notificationBody}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationContent}>{content}</Text>
      </View>
    </Animated.View>
  );
}
