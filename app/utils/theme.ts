// Helper to adjust color brightness (for generating hover/light versions)
export function adjustBrightness(hex: string, percent: number): string {
  // Strip the # if present
  let num = parseInt(hex.replace("#", ""), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;

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
  let r = parseInt(c.substring(0, 2), 16);
  let g = parseInt(c.substring(2, 4), 16);
  let b = parseInt(c.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Apply the custom primary color theme to the document style
export function applyThemeColor(hexColor: string) {
  if (typeof window === "undefined") return;

  // Simple validation for hex color
  let color = hexColor.trim();
  if (!color.startsWith("#")) {
    color = "#" + color;
  }
  const hexRegex = /^#[0-9A-F]{6}$/i;
  if (!hexRegex.test(color)) return;

  const hoverColor = adjustBrightness(color, -10); // 10% darker
  const lightColor = hexToRgba(color, 0.08); // 8% opacity
  const borderColor = hexToRgba(color, 0.2); // 20% opacity

  const root = document.documentElement;
  root.style.setProperty("--primary", color);
  root.style.setProperty("--primary-hover", hoverColor);
  root.style.setProperty("--primary-light", lightColor);
  root.style.setProperty("--primary-border", borderColor);
}
