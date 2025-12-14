import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface GradientFillProps {
  gradientOptions: LinearGradientProps;
  children: React.ReactElement;
  style?: StyleProp<ViewStyle>;
}

export default function GradientFill({ gradientOptions, children, style }: GradientFillProps) {
  return (
    <MaskedView maskElement={children} style={style}>
      <LinearGradient {...gradientOptions} style={{ flex: 1 }}>
        <View style={{ opacity: 0 }}>{children}</View>
      </LinearGradient>
    </MaskedView>
  );
}
