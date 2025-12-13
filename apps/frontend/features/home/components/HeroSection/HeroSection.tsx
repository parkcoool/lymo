import { View } from "react-native";

import Brand from "@/features/home/components/Brand";
// import SearchBoxLink from "@/features/home/components/SearchBoxLink";

import { styles } from "./HeroSection.styles";

export default function HeroSection() {
  return (
    <View style={[styles.container]}>
      <Brand />
      {/* <SearchBoxLink style={styles.searchBox} /> */}
    </View>
  );
}
