import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import Avatar from "./Avatar";

type Props = {
  text: string;
  /** Hora ya formateada */
  time?: string;
  /** `me` va a la derecha en violeta; `agent`, a la izquierda con avatar */
  from: "me" | "agent";
  /** Nombre del agente, para las iniciales del avatar */
  agentName?: string;
  testID?: string;
};

/** Burbuja de chat. */
export default function ChatBubble({ text, time, from, agentName = "", testID }: Props) {
  const mine = from === "me";

  return (
    <View testID={testID} style={[styles.row, mine && styles.rowMine]}>
      {!mine ? <Avatar name={agentName} size={40} /> : null}

      <View style={[styles.column, mine && styles.columnMine]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleAgent]}>
          <Text style={[textStyles.value, styles.text]}>{text}</Text>
        </View>
        {time ? <Text style={[textStyles.caption, mine && styles.timeMine]}>{time}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  rowMine: {
    justifyContent: "flex-end",
  },
  column: {
    maxWidth: "78%",
    gap: 4,
  },
  columnMine: {
    alignItems: "flex-end",
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  bubbleAgent: {
    backgroundColor: tokens.glassSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
    borderTopLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: tokens.violet,
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  timeMine: {
    textAlign: "right",
  },
});
