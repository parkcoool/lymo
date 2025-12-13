import { View, Text, TouchableOpacity } from "react-native";

import getSyncText from "@/entities/setting/utils/getSyncText";
import useTrackKey from "@/features/player/hooks/useTrackKey";

import useSyncControl from "../../hooks/useSyncControl";

import Controller from "./Controller";
import { styles } from "./styles";

export default function SyncSetting() {
  const trackKey = useTrackKey();
  const syncControl = useSyncControl(trackKey);
  if (syncControl === null) return null;

  const { value, handlers } = syncControl;

  return (
    <View style={styles.content}>
      <Text style={styles.syncIndicatorText}>
        {value === 0 ? "가사를 원래대로 하이라이트" : `가사를 ${getSyncText(value)} 하이라이트`}
      </Text>

      <View style={styles.bottom}>
        {/* 버튼 및 슬라이더 */}
        <Controller value={value} {...handlers} />

        {/* 리셋 버튼 */}
        <View style={styles.resetButtonWrapper}>
          <TouchableOpacity style={styles.resetButton} onPress={handlers.onReset}>
            <Text style={styles.resetButtonText}>원래대로</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
