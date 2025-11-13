import { Text } from "react-native";

import { getSyncText } from "../SettingBottomSheet.helpers";

import { styles } from "./Sync.styles";

interface SyncIndicatorProps {
  value: number;
}

export default function SyncIndicator({ value }: SyncIndicatorProps) {
  return (
    <Text style={styles.syncIndicatorText}>
      {value === 0 ? "가사를 원래대로 하이라이트" : `가사를 ${getSyncText(value)} 하이라이트`}
    </Text>
  );
}
