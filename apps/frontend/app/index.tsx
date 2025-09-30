import { View } from "react-native";
import HeroSection from "@/features/home/components/HeroSection";

import { styles } from "./index.styles";

export default function Home() {
  return (
    <View style={styles.container}>
      <HeroSection />
    </View>
  );
}
