import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { styles } from "./SearchBoxLink.styles";
import { Pressable, Text, View } from "react-native";

interface SearchBoxLinkProps extends React.ComponentProps<typeof Pressable> {}

export default function SearchBoxLink(props: SearchBoxLinkProps) {
  return (
    <Pressable {...props}>
      <View style={styles.searchBox}>
        <Text style={styles.searchBoxText}>검색</Text>
        <MaterialIcons name="search" size={24} style={styles.searchBoxIcon} />
      </View>
    </Pressable>
  );
}
