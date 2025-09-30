import { View, Dimensions } from "react-native";

import Brand from "@/features/home/components/Brand";
import SearchBoxLink from "@/shared/components/SearchBoxLink";

import { styles } from "./HeroSection.styles";

export default function HeroSection() {
  const windowHeight = Dimensions.get("window").height;

  return (
    <View style={[styles.container, { height: windowHeight * 0.6 }]}>
      <Brand />
      <SearchBoxLink style={styles.searchBox} />
    </View>
  );
}
