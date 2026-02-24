import React from "react";
import { Select, InlineStack, Text } from "@shopify/polaris";
import { LOCALE_NAMES, type Locale } from "../i18n/translations";

/**
 * Language selector component for MRW Pro settings
 * Supports: Español, Català, Galego, Euskara
 */

interface LanguageSelectorProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  label?: string;
}

export function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  const options = Object.entries(LOCALE_NAMES).map(([code, name]) => ({
    label: name,
    value: code,
  }));

  return (
    <Select
      label={label || "Idioma de la aplicación"}
      options={options}
      value={value}
      onChange={(v) => onChange(v as Locale)}
      helpText="La interfaz se mostrará en el idioma seleccionado"
    />
  );
}
