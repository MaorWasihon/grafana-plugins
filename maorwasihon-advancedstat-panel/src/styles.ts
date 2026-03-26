import { CSSProperties } from 'react';
import { StatAdvancedOptions, FontChoice, BoxShadowPreset, FONT_OPTIONS , FontWeightOption} from './types';


function hexOrCssToRgba(color: string, alpha: number): string {
  if (!color) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  if (color.startsWith('rgb')) {
    const parts = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((p) => Number(p.trim()));

    const [r, g, b] = parts;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const normalized = color.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;

  const num = parseInt(full.slice(0, 6), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


export function mapFontChoice(font: FontChoice): string | undefined {
  return FONT_OPTIONS.find((f) => f.value === font)?.css;

}

export function mapFontWeight(weight: FontWeightOption): number {
  switch (weight) {
    case 'regular': return 400;
    case 'bold':    return 700;
  }
}

function applyBoxShadow(style: CSSProperties, preset: BoxShadowPreset, effectiveColor: string) {
  if (preset === 'none') {
    return;
  }

  if (preset === 'soft') {
    style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  } else if (preset === 'strong') {
    style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
  } else if (preset === 'shine') {
    // Glowing / “shine” effect around the card, based on the effective color
    style.boxShadow = `${hexOrCssToRgba(effectiveColor, 0.9)} 0 0 16px, ${hexOrCssToRgba(
      effectiveColor,
      0.4
    )} 0 0 32px`;
  } else if ( preset === 'glow' ) {
    style.boxShadow = `${hexOrCssToRgba(effectiveColor, 0.4)} 0 0 24px`;
  }
}

export function getContainerStyle(
  options: StatAdvancedOptions,
  baseColor?: string
): {style: CSSProperties; className?: string } {
  const style: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };
  
  const classes: string[] = [];

  // Typography
  const fontFamily = mapFontChoice(options.fontChoice);
  if (fontFamily) {
    style.fontFamily = fontFamily;
  }
  
  const weight = mapFontWeight(options.fontWeight);
  style.fontWeight = weight;

  // Border radius (0–50%)
  if (options.borderRadius > 0) {
    style.borderRadius = `${options.borderRadius}%`;
  }

  // Border width + color
  if (options.borderWidth > 0) {
    const color = options.borderColor ?? '#ffffff';
    style.border = `${options.borderWidth}px solid ${color}`;
  }

  // Opacity 0–100 applied to threshold color background
  const alpha = Math.max(0, Math.min(100, options.backgroundOpacity)) / 100;
  const effectiveColor = baseColor ?? '#000000';

  if (alpha > 0) {
    style.backgroundColor = hexOrCssToRgba(effectiveColor, alpha);
  }
  
  if (options.backgroundAnimation === 'pulse') {
    style.animation = 'statAdvancedPulse 5s ease-in-out infinite';
  } else if (options.backgroundAnimation === 'glow') {
    style.animation = 'statAdvancedGlow 4s ease-in-out infinite';
  } else if (options.backgroundAnimation === 'float') {
    style.animation = 'statAdvancedFloat 3s ease-in-out infinite';
  } else if (options.backgroundAnimation === 'bounce') {
    style.animation = 'statAdvancedBounce 0.6s ease-in-out infinite';
  } else if (options.backgroundAnimation === 'pro-glow') {
    style.animation = 'statAdvancedProGlow 2s ease-in-out infinite';
  }

  if (options.backgroundAnimation === 'glass-shimmer') {
    classes.push('stat-advanced-glass-shimmer');
  }
  if (options.enableScanlines) {
    classes.push('stat-advanced-scanlines');
  }
  if (options.backgroundAnimation === 'shimmer-sweep') {
    classes.push('stat-advanced-shimmer-sweep');
  }

  // Shadows, including “shine”
  applyBoxShadow(style, options.boxShadow, effectiveColor);

  const className = classes.length > 0 ? classes.join(' ') : undefined;

  return {  style, className };
}