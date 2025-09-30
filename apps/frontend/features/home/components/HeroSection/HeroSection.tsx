import { View } from "react-native";
import { styles } from "./HeroSection.styles";

import Brand from "@/features/home/components/Brand";
import SearchBoxLink from "@/shared/components/SearchBoxLink";

export default function HeroSection() {
  return (
    <View style={styles.container}>
      <Brand />
      <SearchBoxLink style={styles.searchBox} />
    </View>
  );
}
