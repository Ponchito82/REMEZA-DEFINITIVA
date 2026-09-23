import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing, screenPadding } from "../../theme/spacing";
import BankCard from "./BankCard";

export type CarouselCard = {
  id: string;
  /** "Physical" / "Virtual": titula el carrusel segun la tarjeta visible */
  title: string;
  last4: string;
  holderName: string;
  status: "on" | "off";
  number?: string;
};

type Props = {
  cards: CarouselCard[];
  showData?: boolean;
  offLabel: string;
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Carrusel paginado de tarjetas, con titulo e indicador de puntos. */
export default function CardCarousel({
  cards,
  showData = false,
  offLabel,
  onIndexChange,
  style,
  testID,
}: Props) {
  const { width } = useWindowDimensions();
  const pageWidth = width - screenPadding * 2;
  const [index, setIndex] = useState(0);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (next === index) return;
    setIndex(next);
    onIndexChange?.(next);
  };

  return (
    <View style={style}>
      <Text testID={testID ? `${testID}-title` : undefined} style={styles.title}>
        {cards[index]?.title ?? ""}
      </Text>

      <FlatList
        data={cards}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(card) => card.id}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <BankCard
            last4={item.last4}
            holderName={item.holderName}
            status={item.status}
            number={item.number}
            showData={showData}
            offLabel={offLabel}
            style={{ width: pageWidth }}
            testID={testID ? `${testID}-${item.id}` : undefined}
          />
        )}
      />

      <View style={styles.dots}>
        {cards.map((card, dotIndex) => (
          <View
            key={card.id}
            style={[styles.dot, dotIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.progressInactive,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});
