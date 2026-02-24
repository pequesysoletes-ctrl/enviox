import React from "react";
import { InlineStack, Text, Box } from "@shopify/polaris";

/**
 * EnvioBrand — Branded header component for Correos Pro by Enviox
 * Shows the Enviox wordmark + "Correos Pro" badge
 * Uses Correos yellow (#FFCC00) for brand accent
 */

const BRAND_STYLES = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,
  wordmark: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#0F172A",
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1,
  } as React.CSSProperties,
  wordmarkX: {
    color: "#3B82F6",
  } as React.CSSProperties,
  badge: {
    background: "#1A365D",
    color: "white",
    fontSize: "11px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    lineHeight: 1.2,
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,
  badgeCorreos: {
    color: "#FFCC00", // Correos yellow
  } as React.CSSProperties,
  footerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px 0 4px",
    opacity: 0.5,
  } as React.CSSProperties,
  footerText: {
    fontSize: "11px",
    color: "#94A3B8",
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
  footerWordmark: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748B",
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
};

/** Main brand header: ENVIOX [Correos Pro] */
export function EnvioBrandHeader({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const scale = size === "large" ? 1.3 : size === "small" ? 0.8 : 1;

  return (
    <div style={BRAND_STYLES.container}>
      <span
        style={{
          ...BRAND_STYLES.wordmark,
          fontSize: `${24 * scale}px`,
        }}
      >
        ENVIO<span style={BRAND_STYLES.wordmarkX}>X</span>
      </span>
      <span
        style={{
          ...BRAND_STYLES.badge,
          fontSize: `${11 * scale}px`,
          padding: `${4 * scale}px ${10 * scale}px`,
        }}
      >
        <span style={BRAND_STYLES.badgeCorreos}>Correos</span> Pro
      </span>
    </div>
  );
}

/** Subtle footer: "Powered by ENVIOX · v1.0" */
export function EnvioBrandFooter() {
  return (
    <div style={BRAND_STYLES.footerContainer}>
      <span style={BRAND_STYLES.footerText}>Powered by</span>
      <span style={BRAND_STYLES.footerWordmark}>
        ENVIO<span style={{ color: "#3B82F6" }}>X</span>
      </span>
      <span style={{ ...BRAND_STYLES.footerText, borderLeft: "1px solid #CBD5E1", paddingLeft: "8px", marginLeft: "2px" }}>
        v1.0 · Feb 2026
      </span>
    </div>
  );
}

/** Brand divider — Correos warm gradient */
export function BrandDivider() {
  return (
    <div
      style={{
        height: "3px",
        background: "linear-gradient(90deg, #FFCC00, #3B82F6, #FFCC00)",
        borderRadius: "2px",
        opacity: 0.6,
        margin: "4px 0",
      }}
    />
  );
}

/** Brand accent card background — Correos yellow + blue */
export function BrandAccentBar() {
  return (
    <div
      style={{
        height: "4px",
        background: "linear-gradient(90deg, #FFCC00, #3B82F6)",
        borderRadius: "4px 4px 0 0",
        marginBottom: "-4px",
      }}
    />
  );
}
