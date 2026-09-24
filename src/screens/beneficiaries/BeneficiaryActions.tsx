import React from "react";
import { StyleSheet, View } from "react-native";
import { Pencil, Send, Star, Trash2 } from "lucide-react-native";

import { ActionCircle } from "../../components/ui";

type Props = {
  t: any;
  favorite: boolean;
  onSend: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  testIDPrefix: string;
};

/** Acciones rapidas de un beneficiario: enviar, favorito, editar, eliminar. */
export default function BeneficiaryActions({
  t,
  favorite,
  onSend,
  onToggleFavorite,
  onEdit,
  onDelete,
  testIDPrefix,
}: Props) {
  return (
    <View style={styles.root}>
      <ActionCircle testID={`${testIDPrefix}.sendAction`} icon={Send} label={t.sendMoney} onPress={onSend} />
      <ActionCircle
        testID={`${testIDPrefix}.favoriteAction`}
        icon={Star}
        label={t.markFavorite}
        active={favorite}
        onPress={onToggleFavorite}
      />
      <ActionCircle testID={`${testIDPrefix}.editAction`} icon={Pencil} label={t.editAction} onPress={onEdit} />
      <ActionCircle
        testID={`${testIDPrefix}.deleteAction`}
        icon={Trash2}
        label={t.deleteAction}
        tone="danger"
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    marginTop: 12,
  },
});
