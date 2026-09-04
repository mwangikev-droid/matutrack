/** Utilities for the per-route brand colours stored as hex in the dataset. */

function channel(hex: string, start: number) {
  return Number.parseInt(hex.slice(start, start + 2), 16) / 255;
}

function linearise(value: number) {
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

/** Relative luminance per WCAG, used to pick readable text on a route colour. */
export function luminance(hex: string) {
  const normalised = hex.replace('#', '');
  if (normalised.length !== 6) return 0.5;
  const red = linearise(channel(normalised, 0));
  const green = linearise(channel(normalised, 2));
  const blue = linearise(channel(normalised, 4));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function onColorText(hex: string) {
  return luminance(hex) > 0.55 ? '#1c1917' : '#ffffff';
}

export function withAlpha(hex: string, alpha: number) {
  const normalised = hex.replace('#', '');
  if (normalised.length !== 6) return hex;
  const red = Number.parseInt(normalised.slice(0, 2), 16);
  const green = Number.parseInt(normalised.slice(2, 4), 16);
  const blue = Number.parseInt(normalised.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
