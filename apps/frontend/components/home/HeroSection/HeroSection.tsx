import { View, Dimensions } from "react-native";

import Brand from "@/components/home/Brand";
import SearchBoxLink from "@/components/home/SearchBoxLink";

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
