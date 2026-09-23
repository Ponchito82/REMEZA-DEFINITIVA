import React from "react";
import UiSelectField from "./ui/SelectField";
import type { IconComponent } from "./ui/GlassInput";

type Option = { label: string; value: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  /** Titulo de la hoja inferior. Si falta, usa `label` y luego `placeholder`. */
  title?: string;
  icon?: IconComponent;
  highlighted?: boolean;
  onSelect: (value: string) => void;
  testID?: string;
};

/**
 * Campo de seleccion de las pantallas internas. Es una fachada sobre
 * `ui/SelectField`: se conserva porque lo importan varias pantallas con esta
 * API.
 *
 * El icono va **solo** a la insignia de la hoja, no dentro del campo: los
 * formularios del PDF no llevan icono a la izquierda.
 */
export default function SelectField({
  label,
  value,
  options,
  placeholder,
  title,
  icon,
  highlighted = false,
  onSelect,
  testID,
}: Props) {
  return (
    <UiSelectField
      label={label || undefined}
      placeholder={placeholder || label}
      value={value}
      options={options}
      onSelect={onSelect}
      sheetIcon={icon}
      sheetTitle={title || label || placeholder}
      highlighted={highlighted}
      testID={testID}
    />
  );
}
