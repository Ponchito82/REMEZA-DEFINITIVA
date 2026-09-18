import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  TouchableOpacity
} from "react-native";
import { BanknoteX, X } from "lucide-react-native";

import { styles } from "../theme/styles";
import { PURPLE, PURPLE_DARK } from "../theme/colors";
import { TransactionsFilter, ViewName } from "../types/app";

type TransactionItem = {
  id: string;
  type: string;
  label: string;
  amount: string;
  date: string;
  color: string;
};

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  transactionsFilter: TransactionsFilter;
  setTransactionsFilter: (filter: TransactionsFilter) => void;

  filteredTransactions: TransactionItem[];
};

export default function TransactionsView({
  t,
  setView,
  transactionsFilter,
  setTransactionsFilter,
  filteredTransactions,
}: Props) {
  return (
    <SafeAreaView style={styles.pageScreen}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="transactions-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.transactionsTitle}</Text>
        <Text style={styles.pageSubtitle}>{t.transactionsSubtitle}</Text>

        <View style={styles.filterWrap}>
          {[
            { key: "all", label: t.all },
            { key: "virtual", label: t.virtual },
            { key: "physical", label: t.physical },
            { key: "remittance", label: t.remittance },
            { key: "trading", label: t.trading },
          ].map((item) => (
            <Pressable
              key={item.key}
              testID={`transactions-filterChip-${item.key}`}
              onPress={() => setTransactionsFilter(item.key as TransactionsFilter)}
              style={[
                styles.filterChip,
                transactionsFilter === item.key && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  transactionsFilter === item.key &&
                  styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stack12}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>
                {t.noTransactions}
              </Text>
            </View>
          ) : (
            filteredTransactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                testID={`transactions-item-${item.id}`}
                style={styles.activityRow}
                onPress={() => {
                  t.item = item;               
                  t.item.mxnAmount = "$9000.00";
                  t.item.exchangeRate = "$18.00";
                  t.item.beneficiary = "Juan Lopez";

                  setView("remittanceDetail")
                }}
                activeOpacity={0.7}
              >
              <View key={item.id} style={styles.activityRow}>
                <View style={styles.activityLeft}>
                  <View
                    style={[
                      styles.operationBadge,
                      item.type === "virtual" && {
                        backgroundColor: "#EEF2FF",
                      },
                      item.type === "physical" && {
                        backgroundColor: "#FFF7ED",
                      },
                      item.type === "remittance" && {
                        backgroundColor: PURPLE,
                      },
                      item.type === "trading" && {
                        backgroundColor: "#ECFDF5",
                      },
                    ]}
                  >
                    <Text style={[
                      styles.operationBadgeText,
                      item.type === "remittance" && {
                        color: "#ffffff",
                      }
                    ]}>
                      {
                        item.type === "virtual"
                          ? t.virtual
                          : item.type === "physical"
                            ? t.physical
                            : item.type === "remittance"
                              ? t.remittance
                              : t.trading}
                    </Text>                    
                  </View>
                  
                  <View>
                    <Text style={styles.activityLabel}>
                      {item.label}
                    </Text>
                    <Text style={styles.operationDate}>
                      {item.date}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.activityAmount,
                    { color: item.color },
                  ]}
                >
                  {item.amount}
                </Text>                

              </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}