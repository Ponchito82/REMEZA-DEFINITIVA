import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { metrics } from "../../theme/radius";

export type SegmentedTabItem = { label: string; value: string };

type Props = {
  items: SegmentedTabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Prefijo de los testID: cada pestana queda como `${testID}-<value>` */
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/** Pestanas de ancho repartido, alto 44. */
export default function SegmentedTabs({ items, value, onChange, testID, style }: Props) {
  return (
    <View style={[styles.root, style]} accessibilityRole="tablist">
      {items.map((item) => {
        const active = item.value === value;

        return (
          <Pressable
            key={item.value}
            testID={testID ? `${testID}-${item.value}` : undefined}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.value)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text
              style={[styles.label, active && styles.labelActive]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    height: 44,
    padding: 3,
    gap: 3,
    borderRadius: metrics.radius.tab,
    backgroundColor: tokens.glassSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
  },
  tab: {
    flex: 1,
    borderRadius: metrics.radius.tab - 3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabActive: {
    backgroundColor: tokens.violet,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    includeFontPadding: false,
    color: tokens.textSecondary,
  },
  labelActive: {
    color: tokens.textPrimary,
  },
});
