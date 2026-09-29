import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { X } from "lucide-react-native";
import { tokens, PURPLE } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { metrics, radius } from "../../theme/radius";
import { TOUR_STEPS } from "../../onboarding/tourSteps";
import { measureTarget, TourRect } from "../../onboarding/tourTargets";
import PrimaryButton from "./PrimaryButton";
import StepProgress from "./StepProgress";

type Props = {
  t: any;
  stepIndex: number;
  onNext: () => void;
  onSkip: () => void;
};

/**
 * Guia paso a paso interactiva: un cuadro alrededor del componente del paso
 * (con su nombre) y una tarjeta con la funcion, el progreso y los botones
 * Saltar / Siguiente. No es un Modal: atenua toda la pantalla salvo un hueco sobre el objetivo, pero la capa es
 * `box-none` y el cuadro `none`, asi que los toques llegan a la app y el
 * usuario puede probar el componente. Al no ser Modal, las coordenadas de
 * `measureInWindow` son casi las de esta capa, y aun asi se corrige con el origen medido de la capa. El
 * objetivo se vuelve a medir periodicamente para seguir el scroll.
 */
export default function TourOverlay({ t, stepIndex, onNext, onSkip }: Props) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const [rect, setRect] = React.useState<TourRect | null>(null);
  const layerRef = React.useRef<View>(null);
  const [layerSize, setLayerSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setRect(null);
    const id = step.targetId;
    if (!id) return;
    let cancelled = false;
    const measure = async () => {
      // Se mide tambien la capa del overlay y se resta su origen: asi el cuadro
      // queda bien aunque la ventana y la capa no compartan origen (p. ej. por
      // la barra de estado en Android).
      const [target, origin] = await Promise.all([
        measureTarget(id),
        new Promise<{ x: number; y: number } | null>((resolve) => {
          const layer = layerRef.current;
          if (!layer) return resolve(null);
          layer.measureInWindow((x, y) => resolve({ x, y }));
        }),
      ]);
      if (cancelled) return;
      const next = target && origin ? { ...target, x: target.x - origin.x, y: target.y - origin.y } : null;
      setRect((prev) => {
        if (!next) return prev === null ? prev : null;
        if (
          prev &&
          Math.abs(prev.x - next.x) < 0.5 &&
          Math.abs(prev.y - next.y) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
        ) {
          return prev;
        }
        return next;
      });
    };
    measure();
    const timer = setInterval(measure, 250);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [step.targetId, stepIndex]);

  // La tarjeta va abajo salvo que el objetivo este en la mitad inferior.
  const cardOnTop = rect ? rect.y + rect.height / 2 > windowHeight / 2 : false;
  const frame = rect
    ? {
        left: rect.x - FRAME_PAD,
        top: rect.y - FRAME_PAD,
        width: rect.width + FRAME_PAD * 2,
        height: rect.height + FRAME_PAD * 2,
      }
    : null;
  const frameRadius = frame ? Math.min(frame.height / 2, 18) : 0;
  // Fondo atenuado con un hueco redondeado sobre el objetivo (relleno evenodd).
  const { width: lw, height: lh } = layerSize;
  let dimPath = `M0 0H${lw}V${lh}H0Z`;
  if (frame) {
    const { left: x, top: y, width: w, height: h } = frame;
    const r = frameRadius;
    dimPath += ` M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  }
  const chipAbove = frame ? frame.top - CHIP_HEIGHT - 4 >= insets.top : false;

  return (
    <View
      ref={layerRef}
      collapsable={false}
      pointerEvents="box-none"
      style={styles.layer}
      onLayout={(e) => setLayerSize(e.nativeEvent.layout)}
    >
      {lw > 0 ? (
        <Svg pointerEvents="none" width={lw} height={lh} style={StyleSheet.absoluteFill}>
          <Path d={dimPath} fill="rgba(2,2,26,0.78)" fillRule="evenodd" />
        </Svg>
      ) : null}
      {frame ? (
        <View
          pointerEvents="none"
          style={[
            styles.frame,
            frame,
            { borderRadius: frameRadius },
          ]}
        >
          <View
            style={[
              styles.chip,
              chipAbove
                ? { top: -CHIP_HEIGHT - 4 }
                : { bottom: -CHIP_HEIGHT - 4 },
            ]}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              {t[step.titleKey]}
            </Text>
          </View>
        </View>
      ) : null}

      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          cardOnTop
            ? { top: Math.max(insets.top, spacing.lg) }
            : { bottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <StepProgress
              testID="onboardingTour-progress"
              total={TOUR_STEPS.length}
              current={stepIndex + 1}
              style={styles.progress}
            />
            <Pressable
              testID="onboardingTour-skipButton"
              accessibilityRole="button"
              accessibilityLabel={t.tourSkip}
              onPress={onSkip}
              style={styles.skipButton}
              hitSlop={12}
            >
              <X size={15} color={tokens.textPrimary} strokeWidth={2} />
              <Text style={styles.skipText}>{t.tourSkip}</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{t[step.titleKey]}</Text>
          <Text style={styles.description}>{t[step.descriptionKey]}</Text>

          <PrimaryButton
            testID="onboardingTour-nextButton"
            title={isLast ? t.tourFinish : t.tourNext}
            onPress={onNext}
            showArrow={!isLast}
          />
        </View>
      </View>
    </View>
  );
}

const FRAME_PAD = 5;
const CHIP_HEIGHT = 24;

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  frame: {
    position: "absolute",
    borderWidth: 2,
    borderColor: PURPLE,
    shadowColor: PURPLE,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  chip: {
    position: "absolute",
    left: -2,
    height: CHIP_HEIGHT,
    maxWidth: 220,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: PURPLE,
    justifyContent: "center",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: tokens.sheetSurface,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progress: {
    flex: 1,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skipText: {
    color: tokens.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: tokens.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.textSecondary,
    marginBottom: spacing.lg,
  },
});
