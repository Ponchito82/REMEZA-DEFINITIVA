import React from "react";
import { StyleSheet, View } from "react-native";
import { tokens } from "../../theme/colors";

const SIZE = 24;

/** Circulo de seleccion unica. */
export default function RadioDot({ selected = false }: { selected?: boolean }) {
  return (
    <View style={[styles.root, selected && styles.selected]}>
      {selected ? <View style={styles.dot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1.5,
    borderColor: tokens.textDisabled,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderColor: tokens.violet,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.violet,
  },
});
