import React from "react";
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { primaryGradient, primaryGradientDeep } from "../../theme/gradients";
import { radius, sizes } from "../../theme/radius";
import Glow from "./Glow";
import type { IconComponent } from "./GlassInput";

export type ButtonVariant = "primary" | "gradient" | "ghost" | "outline";

/** Adorno de la derecha: flecha suelta, o flecha dentro de un circulo. */
export type ButtonAdornment = "none" | "arrow" | "arrowCircle";

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  /** Icono a la izquierda del texto, con el conjunto centrado */
  leftIcon?: IconComponent;
  /** Circulo con flecha a la derecha. Implicito en `gradient` y `ghost`. */
  rightArrow?: boolean;
  rightAdornment?: ButtonAdornment;
  /** `lg` sube el alto a 56, para las pantallas de seguridad y multidivisa */
  size?: "md" | "lg";
  /** Usa el degradado profundo en vez del de marca */
  deepGradient?: boolean;
  radius?: "md" | "pill";
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

const ARROW_SIZE = 40;

/**
 * Boton de la app.
 *
 * Deshabilitado **no usa `opacity`**: eso deslava el conjunto entero, texto
 * incluido. Cada variante cambia a su propia superficie apagada, que se lee
 * nitida.
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon: LeftIcon,
  rightArrow,
  rightAdornment,
  size = "md",
  deepGradient = false,
  radius: radiusProp,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const isBlocked = disabled || loading;
  const corner = radius[radiusProp ?? (variant === "primary" ? "md" : "pill")];
  const isGhost = variant === "ghost";
  const isOutline = variant === "outline";
  const isHollow = isGhost || isOutline;

  /** `rightArrow` es la API vieja; `rightAdornment` la que trae el diseno nuevo. */
  const adornment: ButtonAdornment =
    rightAdornment ?? ((rightArrow ?? variant !== "primary") ? "arrowCircle" : "none");

  const height = size === "lg" ? sizes.buttonLarge : sizes.button;
  const ramp = deepGradient ? primaryGradientDeep : primaryGradient;

  const surface = (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isBlocked, busy: loading }}
      onPress={onPress}
      disabled={isBlocked}
      style={({ pressed }) => [
        styles.root,
        { height, borderRadius: corner },
        fullWidth && styles.fullWidth,
        variant === "primary" && !isBlocked && styles.primarySurface,
        isGhost && styles.ghostSurface,
        isOutline && styles.outlineSurface,
        isBlocked && styles.blockedSurface,
        pressed && !isBlocked && styles.pressed,
      ]}
    >
      {variant === "gradient" && !isBlocked ? (
        <LinearGradient
          colors={ramp.colors}
          locations={ramp.locations}
          start={ramp.start}
          end={ramp.end}
          style={[StyleSheet.absoluteFill, { borderRadius: corner }]}
        />
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.text.primary} />
      ) : (
        <View style={styles.label}>
          {LeftIcon ? (
            <LeftIcon size={20} color={colors.text.primary} strokeWidth={2} />
          ) : null}

          <Text
            style={[typography.button, (isGhost || isBlocked) && styles.labelMuted]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}

      {adornment === "arrowCircle" && !loading ? (
        <View
          style={[styles.arrow, (isGhost || isBlocked) && styles.arrowMuted]}
          pointerEvents="none"
        >
          <ArrowRight
            size={18}
            color={isGhost || isBlocked ? colors.text.placeholder : colors.text.primary}
            strokeWidth={2}
          />
        </View>
      ) : null}

      {adornment === "arrow" && !loading ? (
        <View style={styles.bareArrow} pointerEvents="none">
          <ArrowRight
            size={22}
            color={isBlocked ? colors.text.placeholder : colors.text.primary}
            strokeWidth={2}
          />
        </View>
      ) : null}
    </Pressable>
  );

  /**
   * El glow solo acompana a las variantes llenas y activas. El envoltorio
   * conserva `alignSelf: stretch` igualmente: sin el, dentro de un contenedor
   * centrado el boton se encoge al ancho del texto.
   */
  if (isHollow || isBlocked) {
    return <View style={[fullWidth && styles.stretchWrap, style]}>{surface}</View>;
  }

  return (
    <Glow radius={16} opacity={0.5} offsetY={8} corner={corner} stretch={fullWidth} style={style}>
      {surface}
    </Glow>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  fullWidth: {
    width: "100%",
  },
  stretchWrap: {
    alignSelf: "stretch",
  },
  primarySurface: {
    backgroundColor: colors.primary,
  },
  ghostSurface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  /** Como el ghost pero con el texto en blanco y el borde de marca. */
  outlineSurface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockedSurface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  labelMuted: {
    color: colors.text.placeholder,
  },
  arrow: {
    position: "absolute",
    right: 6,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowMuted: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  bareArrow: {
    position: "absolute",
    right: 20,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
