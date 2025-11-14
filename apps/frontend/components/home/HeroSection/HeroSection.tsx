import { View } from "react-native";

import Brand from "@/components/home/Brand";
// import SearchBoxLink from "@/components/home/SearchBoxLink";

import { styles } from "./HeroSection.styles";

export default function HeroSection() {
  return (
    <View style={[styles.container]}>
      <Brand />
      {/* <SearchBoxLink style={styles.searchBox} /> */}
    </View>
  );
}
