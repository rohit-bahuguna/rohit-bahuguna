// Helper to adjust color brightness (for generating hover/light versions)
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Convert hex to rgba string
export function hexToRgba(hex: string, opacity: number): string {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generates CSS string for server-side rendering
export function getThemeCss(hexColor: string): string {
  let color = hexColor?.trim() || "#573e60";
  if (!color.startsWith("#")) color = "#" + color;
  const hexRegex = /^#[0-9A-F]{6}$/i;
  if (!hexRegex.test(color)) color = "#573e60";

  const hoverColor = adjustBrightness(color, -10);
  const lightColor = hexToRgba(color, 0.08);
  const borderColor = hexToRgba(color, 0.2);

  return `:root {
  --primary: ${color} !important;
  --primary-hover: ${hoverColor} !important;
  --primary-light: ${lightColor} !important;
  --primary-border: ${borderColor} !important;
}`;
}

// Apply the custom primary color theme to the document style in client
export function applyThemeColor(hexColor: string) {
  if (typeof window === "undefined") return;

  let color = hexColor.trim();
  if (!color.startsWith("#")) {
    color = "#" + color;
  }
  const hexRegex = /^#[0-9A-F]{6}$/i;
  if (!hexRegex.test(color)) return;

  const hoverColor = adjustBrightness(color, -10);
  const lightColor = hexToRgba(color, 0.08);
  const borderColor = hexToRgba(color, 0.2);

  const root = document.documentElement;
  root.style.setProperty("--primary", color);
  root.style.setProperty("--primary-hover", hoverColor);
  root.style.setProperty("--primary-light", lightColor);
  root.style.setProperty("--primary-border", borderColor);
}
