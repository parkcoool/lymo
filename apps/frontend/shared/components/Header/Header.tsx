import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBoxLink from "@/shared/components/SearchBoxLink";

import { styles } from "./Header.styles";
import { TouchableOpacity, View } from "react-native";

export default function Header({
  back,
  navigation,
  route,
}: NativeStackHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 상단 영역 */}
      <SafeAreaView edges={["top"]} />

      <View style={styles.header}>
        <View style={styles.left}>
          {/* 뒤로 가기 버튼 */}
          {back && (
            <TouchableOpacity onPress={navigation.goBack}>
              <MaterialIcons
                name="chevron-left"
                size={28}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          )}

          {/* 검색 박스 */}
          {back && <SearchBoxLink style={styles.searchBox} />}
        </View>

        <View style={styles.right}>
          {/* 설정 버튼 */}
          {
            <TouchableOpacity>
              <MaterialIcons
                name="settings"
                size={28}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );
}
