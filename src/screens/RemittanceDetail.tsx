import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import { ViewName } from "../types/app";
import { X } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE, PURPLE_DARK } from "../theme/colors";

type TransactionItem = {
  id: string;
  type: string;
  label: string;
  amount: string;
  mxnAmount: string;
  exchangeRate: string;
  beneficiary: string;
  date: string;
  color: string;
};

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  item?: TransactionItem;
}
export default function RemittanceDetail({
  t,
  setView,
  item,
 }: Props) {

  const handleCancel = () => {
    console.log("Cancelar remesa", item);

  };

  return (
    <View style={styles.pageScreen}>
        <ScrollView
                contentContainerStyle={styles.pageContent}
                showsVerticalScrollIndicator={false}
              >
        <Pressable
          testID="remittanceDetail-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>
        <Text style={styles.pageTitle}>{t.remittanceDetail}</Text>
        <Text style={styles.pageSubtitle}>
            {t.remittanceCancelationInfo}
        </Text>
      <View style={styles.card}>

        <View style={styles.row}>
          <Text style={styles.label}>{t.amountToSendUsd}</Text>
          <Text style={styles.value}>{t.item.amount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.amountToReceiveMxn}</Text>
          <Text style={styles.value}>{t.item.mxnAmount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.exchangeRate}</Text>
          <Text style={styles.value}>{t.item.exchangeRate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t.beneficiary}</Text>
          <Text style={styles.value}>{t.item.beneficiary}</Text>
        </View>

        <TouchableOpacity
          testID="remittanceDetail-cancelButton"
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>
            {t.cancelOperation}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}







