import React from "react";
import Svg, { G, Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { remezaGlyph } from "./remezaGlyph";

type Props = {
  /** Alto del isotipo en dp. El ancho sale de la proporcion del glifo. */
  size: number;
  color?: string;
};

/**
 * Isotipo Remeza dibujado como path vectorial: queda nitido a cualquier
 * tamano y a cualquier densidad, sin necesidad de @2x/@3x.
 *
 * El trazado vive en `remezaGlyph.ts`, vectorizado del logo original. No hay
 * `src/assets/logo/remeza-logo.svg` en el proyecto, pero tampoco hace falta:
 * esto **es** el logo en vectores, no un placeholder.
 */
export default function RemezaLogo({ size, color = colors.textPrimary }: Props) {
  const width = size * (remezaGlyph.width / remezaGlyph.height);
  const scale = width / remezaGlyph.width;

  return (
    <Svg width={width} height={size}>
      <G scale={scale}>
        <Path d={remezaGlyph.path} fill={color} />
      </G>
    </Svg>
  );
}
