import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { X, Check } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import type { IconComponent } from "./GlassInput";

export type SheetOption = { label: string; value: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Icono de la insignia junto al titulo. Sin icono, la insignia no se dibuja. */
  icon?: IconComponent;
  options: SheetOption[];
  /** Valor seleccionado: pinta la pastilla violeta y el check. */
  value?: string;
  onSelect: (value: string) => void;
  testID?: string;
  emptyText?: string;
  /** Contenido extra entre el encabezado y la lista, p. ej. un buscador. */
  children?: React.ReactNode;
};

/**
 * Hoja inferior de seleccion: agarradera, insignia + titulo + cierre, y una
 * lista de opciones con la activa resaltada en una pastilla violeta.
 * Comparten esta hoja `SelectField`, `SearchableSelect` y el selector de pais
 * de `PhoneField`, para que el calendario y todos los menus desplegables se
 * vean iguales.
 */
export default function OptionSheet({
  visible,
  onClose,
  title,
  icon: Icon,
  options,
  value,
  onSelect,
  testID,
  emptyText,
  children,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerStart}>
              {Icon ? (
                <View style={styles.badge}>
                  <Icon size={20} color={colors.textPrimary} strokeWidth={1.75} />
                </View>
              ) : null}
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>

            <Pressable
              testID={testID ? `${testID}-closeButton` : undefined}
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}
            >
              <X size={20} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          </View>

          {children}

          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {options.length === 0 && emptyText ? (
              <Text style={styles.emptyText}>{emptyText}</Text>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isLast = index === options.length - 1;

                return (
                  <Pressable
                    key={option.value}
                    testID={testID ? `${testID}-option-${option.value}` : undefined}
                    onPress={() => onSelect(option.value)}
                    style={({ pressed }) => [
                      styles.option,
                      !isSelected && !isLast && styles.optionDivider,
                      isSelected && styles.optionSelected,
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]} numberOfLines={1}>
                      {option.label}
                    </Text>
                    {isSelected ? <Check size={18} color={colors.textPrimary} /> : null}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,3,15,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "75%",
    backgroundColor: colors.glassSurfaceStrong,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.22)",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  headerStart: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.indigoDeep,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  title: {
    flexShrink: 1,
    fontFamily: fontFamily.bold,
    fontSize: 19,
    color: colors.textPrimary,
    includeFontPadding: false,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  list: {
    flexShrink: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  optionSelected: {
    borderRadius: 18,
    backgroundColor: colors.violet,
  },
  optionText: {
    flexShrink: 1,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textPrimary,
    includeFontPadding: false,
  },
  optionTextSelected: {
    fontFamily: fontFamily.semibold,
  },
  emptyText: {
    paddingVertical: 24,
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textSecondary,
    includeFontPadding: false,
  },
});
