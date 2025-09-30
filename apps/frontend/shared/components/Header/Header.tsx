import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { styles } from "./Header.styles";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Header({ back, navigation }: NativeStackHeaderProps) {
  return (
    <View style={styles.container}>
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
          <Pressable style={styles.searchBoxWrapper}>
            <View style={styles.searchBox}>
              <Text style={styles.searchBoxText}>검색</Text>
              <MaterialIcons
                name="search"
                size={24}
                style={styles.searchBoxIcon}
              />
            </View>
          </Pressable>
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
