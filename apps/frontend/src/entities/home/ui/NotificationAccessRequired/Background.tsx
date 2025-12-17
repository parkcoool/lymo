import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { styles } from "./styles";

export default function Background() {
  // 애니메이션 값
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  // 둥둥 떠다니는 애니메이션 설정
  useEffect(() => {
    // 첫 번째 이미지 애니메이션
    const animation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // 두 번째 이미지 애니메이션
    const animation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -20,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    animation1.start();
    animation2.start();

    return () => {
      animation1.stop();
      animation2.stop();
    };
  }, [floatAnim1, floatAnim2]);

  return (
    <View style={styles.background}>
      <Animated.Image
        source={require("../../assets/mock_2.png")}
        style={[styles.mock2, { transform: [{ translateY: floatAnim2 }] }]}
      />
      <Animated.Image
        source={require("../../assets/mock_1.png")}
        style={[styles.mock1, { transform: [{ translateY: floatAnim1 }] }]}
      />
    </View>
  );
}
