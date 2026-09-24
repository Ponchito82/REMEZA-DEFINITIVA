import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import ListRow from "./ListRow";
import type { IconComponent } from "./GlassInput";

type Props = {
  icon: IconComponent;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Fila informativa: la de ListRow sin interaccion ni accesorio. */
export default function FeatureRow(props: Props) {
  return <ListRow {...props} right="none" />;
}
