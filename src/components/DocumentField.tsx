import React from "react";
import { View, Text, Pressable } from "react-native";
import { Upload, FileText } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";

type Props = {
  label: string;
  fileName?: string | null;
  buttonText: string;
  emptyText: string;
  onPress: () => void;
  testID?: string;
};

export default function DocumentField({
  label,
  fileName,
  buttonText,
  emptyText,
  onPress,
  testID,
}: Props) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>

      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [styles.uploadBox, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.uploadIconWrap}>
          {fileName ? (
            <FileText size={18} color={PURPLE} />
          ) : (
            <Upload size={18} color={PURPLE} />
          )}
        </View>

        <View style={styles.uploadTextWrap}>
          <Text style={styles.uploadPrimaryText}>{fileName || emptyText}</Text>
          <Text style={styles.uploadSecondaryText}>{buttonText}</Text>
        </View>
      </Pressable>
    </View>
  );
}