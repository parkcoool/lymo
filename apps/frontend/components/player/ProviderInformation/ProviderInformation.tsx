import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pro } from "@lymo/schemas/doc";
import { View, Text } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

import { styles } from "./ProviderInformation.styles";

interface ProviderInformationProps {
  provider?: ProviderDoc;
}

export default function ProviderInformation({ provider }: ProviderInformationProps) {
  if (!provider)
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={20} opacity={0.2} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.providerNameWrapper}>
        <MaterialIcons name="create" size={20} style={styles.providerNameIcon} />
        <Text style={styles.providerNameText}>{provider.providerName} 제공</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.providerUpdatedAtText}>{`${formatRelativeTime(
        provider.updatedAt
      )} 전`}</Text>
    </View>
  );
}
