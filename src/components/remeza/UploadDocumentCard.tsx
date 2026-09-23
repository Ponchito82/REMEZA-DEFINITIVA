import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Upload } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { GlassCard } from "../ui";

type Props = {
  title: string;
  /** "Upload document" */
  actionLabel: string;
  /** "No file selected" */
  emptyLabel: string;
  fileName?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const DROP_SIZE = 64;

/** Card de subida de identificacion del alta. */
export default function UploadDocumentCard({
  title,
  actionLabel,
  emptyLabel,
  fileName,
  onPress,
  style,
  testID,
}: Props) {
  return (
    <GlassCard style={style}>
      <Text style={typography.bodyStrong}>{title}</Text>

      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${actionLabel}`}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={styles.drop}>
          <Upload size={22} color={colors.primaryLight} strokeWidth={2} />
        </View>

        <View style={styles.text}>
          <Text style={typography.bodyStrong} numberOfLines={1}>
            {actionLabel}
          </Text>
          <Text
            testID={testID ? `${testID}-fileName` : undefined}
            style={[typography.caption, styles.fileName]}
            numberOfLines={1}
          >
            {fileName ?? emptyLabel}
          </Text>
        </View>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  drop: {
    width: DROP_SIZE,
    height: DROP_SIZE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primaryLight,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  fileName: {
    color: colors.text.placeholder,
  },
  pressed: {
    opacity: 0.8,
  },
});
