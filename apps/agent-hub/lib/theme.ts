import { type Theme } from "@coinbase/cdp-react/theme";

/**
 * Map the dark agentic palette into CDP React's theme token system so that
 * the SDK's own UI (auth modal, buttons, etc.) matches the app's dark style.
 */
export const darkTheme: Partial<Theme> = {
  // Backgrounds
  "colors-bg-default": "#08090c",
  "colors-bg-alternate": "#0f1117",
  "colors-bg-secondary": "#161a23",
  "colors-bg-overlay": "rgba(8, 9, 12, 0.85)",
  "colors-bg-skeleton": "#1e2330",

  // Accent (Coinbase blue)
  "colors-bg-primary": "#0052ff",
  "colors-fg-primary": "#0052ff",
  "colors-fg-onPrimary": "#ffffff",
  "colors-line-primary": "#0052ff",

  // Text
  "colors-fg-default": "#e8ecf0",
  "colors-fg-muted": "#6b7480",
  "colors-fg-onSecondary": "#e8ecf0",

  // Borders
  "colors-line-default": "#1e2330",
  "colors-line-heavy": "#3a4050",

  // Typography
  "font-family-sans": "'Inter', system-ui, -apple-system, sans-serif",
};
