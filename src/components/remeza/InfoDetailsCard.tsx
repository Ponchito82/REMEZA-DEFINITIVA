import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, sizes } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import type { IconComponent } from "../ui";

export type InfoDetailItem = {
  icon: IconComponent;
  label: string;
  value: string;
};

type Props = {
  items: InfoDetailItem[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Card con los datos del inicio de sesion sospechoso. El divisor arranca en el
 * texto y no en el icono, asi que va dentro del bloque derecho de cada fila.
 */
export default function InfoDetailsCard({ items, style, testID }: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;

        return (
          <View key={item.label} style={styles.row}>
            <View style={styles.iconCircle}>
              <Icon size={24} color={colors.heroCircle.icon} strokeWidth={2} />
            </View>

            <View style={[styles.text, !isLast && styles.divided]}>
              <Text style={typography.listItemDescription}>{item.label}</Text>
              <Text
                testID={testID ? `${testID}-value-${index}` : undefined}
                style={typography.infoValue}
              >
                {item.value}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  iconCircle: {
    width: sizes.listIcon,
    height: sizes.listIcon,
    borderRadius: sizes.listIcon / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.iconCircleBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: 14,
  },
  divided: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});
