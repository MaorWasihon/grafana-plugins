import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SvgIconType =
  | 'none'
  | 'circle'
  | 'warning'
  | 'exclamation'
  | 'square'
  | 'diamond'
  | 'checkmark';

export const SVG_ICON_OPTIONS: Array<{ value: SvgIconType; label: string }> = [
  { value: 'none',        label: '— None —'      },
  { value: 'circle',      label: '⬤  Circle'      },
  { value: 'warning',     label: '⚠  Warning'     },
  { value: 'exclamation', label: '❕  Exclamation' },
  { value: 'square',      label: '⬛  Square'      },
  { value: 'diamond',     label: '◆  Diamond'     },
  { value: 'checkmark',   label: '✔  Checkmark'   },
];

export interface SvgIconProps {
  type: SvgIconType;
  /** Any valid CSS color – drives every stroke, fill and glow */
  color: string;
  /** Width = height in px */
  size: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Global keyframe injection (runs once per page)
// ─────────────────────────────────────────────────────────────────────────────

const ANIM_STYLE_ID = 'sai-global-keyframes';

function ensureKeyframes() {
  if (typeof document === 'undefined') { return; }
  if (document.getElementById(ANIM_STYLE_ID)) { return; }

  const css = `
    /* sai = Stat Advanced Icons */

    @keyframes sai-pulse {
      0%, 100% { opacity: 0.35; transform: scale(0.75); }
      50%       { opacity: 1;    transform: scale(1.1);  }
    }

    @keyframes sai-flicker {
      0%,  88%, 100% { opacity: 1;   }
      90%, 96%       { opacity: 0.3; }
    }

    @keyframes sai-spin {
      from { transform: rotate(0deg);   }
      to   { transform: rotate(360deg); }
    }

    @keyframes sai-diamond-beat {
      0%, 100% { transform: rotate(45deg) scale(1);    }
      50%       { transform: rotate(45deg) scale(1.08); }
    }
  `;

  const el = document.createElement('style');
  el.id = ANIM_STYLE_ID;
  el.textContent = css;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Produce a CSS box-shadow glow string for the given color */
function glow(color: string, r: number): string {
  return `0 0 ${r}px ${color}, 0 0 ${r * 2}px ${color}55`;
}

/** Hex colour at 8% opacity as CSS rgba – for very faint background fills */
function fillTint(color: string): string {
  return `color-mix(in srgb, ${color} 8%, transparent)`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CIRCLE
// Source: shapes.html  .f-circle / .f-circle-inner
// Design: outer ghost ring → bright HUD ring → pulsing inner dot
// ─────────────────────────────────────────────────────────────────────────────
function CircleIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s = size / 40;   // scale factor (base design is 40 px)

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ghost outer ring */}
      <div style={{
        position: 'absolute',
        width: 44 * s, height: 44 * s,
        border: `${1 * s}px solid ${color}`,
        borderRadius: '50%',
        opacity: 0.2,
      }} />

      {/* Main glowing ring */}
      <div style={{
        width: 34 * s, height: 34 * s,
        border: `${2 * s}px solid ${color}`,
        borderRadius: '50%',
        background: fillTint(color),
        boxShadow: glow(color, 8 * s),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Pulsing inner dot */}
        <div style={{
          width: 13 * s, height: 13 * s,
          background: color,
          borderRadius: '50%',
          boxShadow: glow(color, 5 * s),
          animation: 'sai-pulse 2s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WARNING
// Source: shapes.html  .f-warning / .f-tri / .f-mark
// Design: solid CSS triangle with drop-shadow glow + dark "!" mark on top
// ─────────────────────────────────────────────────────────────────────────────
function WarningIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s = size / 40;
  const halfBase = 18 * s;
  const triH     = 32 * s;

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'relative',
        width: halfBase * 2, height: triH,
        filter: `drop-shadow(0 0 ${5 * s}px ${color}) drop-shadow(0 0 ${10 * s}px ${color}88)`,
      }}>
        {/* CSS border-trick triangle */}
        <div style={{
          width: 0, height: 0,
          borderLeft:   `${halfBase}px solid transparent`,
          borderRight:  `${halfBase}px solid transparent`,
          borderBottom: `${triH}px solid ${color}`,
          borderRadius: `${3 * s}px`,
        }} />
        {/* "!" mark – dark so it sits against the coloured triangle */}
        <span style={{
          position: 'absolute',
          top: '28%', left: '50%',
          transform: 'translateX(-50%)',
          color: '#07090f',
          fontWeight: 900,
          fontSize: `${17 * s}px`,
          lineHeight: 1,
          fontFamily: 'monospace',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>!</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCLAMATION
// Source: shapes.html  .f-excl (flicker)  +  .f-check-circ ring
// Design: glowing circle ring housing a large flickering "!"
// ─────────────────────────────────────────────────────────────────────────────
function ExclamationIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s = size / 40;

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Glowing ring */}
      <div style={{
        width: 34 * s, height: 34 * s,
        border: `${2 * s}px solid ${color}`,
        borderRadius: '50%',
        background: fillTint(color),
        boxShadow: glow(color, 8 * s),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Flickering "!" */}
        <span style={{
          fontSize: `${22 * s}px`,
          fontWeight: 900,
          color,
          lineHeight: 1,
          textShadow: `0 0 ${10 * s}px ${color}`,
          animation: 'sai-flicker 3s infinite',
          fontFamily: 'monospace',
          userSelect: 'none',
          marginTop: `-${2 * s}px`,
        }}>!</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SQUARE
// Source: shapes.html  .f-square / .dots
// Design: glowing rounded rect with dot-grid fill + cyberpunk L-corner accents
// ─────────────────────────────────────────────────────────────────────────────
function SquareIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s   = size / 40;
  const arm = 8 * s;   // corner arm length
  const brd = 2 * s;   // bar thickness of corners

  // 8 bar pieces that form L shapes in the 4 corners
  const corners: React.CSSProperties[] = [
    { position: 'absolute', top: 0,    left: 0,    width: arm,  height: brd,  background: color, opacity: 0.8 },
    { position: 'absolute', top: 0,    left: 0,    width: brd,  height: arm,  background: color, opacity: 0.8 },
    { position: 'absolute', top: 0,    right: 0,   width: arm,  height: brd,  background: color, opacity: 0.8 },
    { position: 'absolute', top: 0,    right: 0,   width: brd,  height: arm,  background: color, opacity: 0.8 },
    { position: 'absolute', bottom: 0, left: 0,    width: arm,  height: brd,  background: color, opacity: 0.8 },
    { position: 'absolute', bottom: 0, left: 0,    width: brd,  height: arm,  background: color, opacity: 0.8 },
    { position: 'absolute', bottom: 0, right: 0,   width: arm,  height: brd,  background: color, opacity: 0.8 },
    { position: 'absolute', bottom: 0, right: 0,   width: brd,  height: arm,  background: color, opacity: 0.8 },
  ];

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ghost outer border */}
      <div style={{
        position: 'absolute',
        width: 38 * s, height: 38 * s,
        border: `${1 * s}px solid ${color}`,
        borderRadius: `${5 * s}px`,
        opacity: 0.18,
      }} />

      {/* Main box */}
      <div style={{
        width: 30 * s, height: 30 * s,
        border: `${brd}px solid ${color}`,
        borderRadius: `${5 * s}px`,
        background: fillTint(color),
        boxShadow: glow(color, 6 * s),
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot grid fill */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: `${6 * s}px ${6 * s}px`,
          opacity: 0.35,
        }} />
        {/* Corner accent bars */}
        {corners.map((st, i) => <div key={i} style={st} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIAMOND
// CSS rotated squares (no direct HTML source, matches the cyberpunk aesthetic)
// Design: ghost outer → glowing main → inner echo, gentle breathing animation
// ─────────────────────────────────────────────────────────────────────────────
function DiamondIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s   = size / 40;
  const rot: React.CSSProperties = { position: 'absolute' };

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ghost outer */}
      <div style={{
        ...rot,
        width: 34 * s, height: 34 * s,
        border: `${1 * s}px solid ${color}`,
        transform: 'rotate(45deg)',
        opacity: 0.18,
      }} />

      {/* Glowing main */}
      <div style={{
        ...rot,
        width: 26 * s, height: 26 * s,
        border: `${2 * s}px solid ${color}`,
        background: fillTint(color),
        boxShadow: glow(color, 6 * s),
        animation: 'sai-diamond-beat 2.5s ease-in-out infinite',
      }} />

      {/* Inner echo */}
      <div style={{
        ...rot,
        width: 13 * s, height: 13 * s,
        border: `${1 * s}px solid ${color}`,
        transform: 'rotate(45deg)',
        opacity: 0.45,
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKMARK
// Source: shapes.html  .f-check-circ / .f-check-v
// Design: glowing ring + CSS rotated-border tick
// ─────────────────────────────────────────────────────────────────────────────
function CheckmarkIcon({ color, size }: { color: string; size: number }) {
  ensureKeyframes();
  const s = size / 40;

  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Glowing ring */}
      <div style={{
        width: 34 * s, height: 34 * s,
        border: `${2 * s}px solid ${color}`,
        borderRadius: '50%',
        background: fillTint(color),
        boxShadow: glow(color, 8 * s),
        position: 'relative',
      }}>
        {/* Tick: two thick border sides, rotated 45° */}
        <div style={{
          position: 'absolute',
          left: `${10 * s}px`,
          top: `${6 * s}px`,
          width: `${8 * s}px`,
          height: `${14 * s}px`,
          border: `solid ${color}`,
          borderWidth: `0 ${3 * s}px ${3 * s}px 0`,
          transform: 'rotate(45deg)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────────────

export function SvgIcon({ type, color, size }: SvgIconProps): JSX.Element | null {
  if (type === 'none') { return null; }

  switch (type) {
    case 'circle':      return <CircleIcon      color={color} size={size} />;
    case 'warning':     return <WarningIcon      color={color} size={size} />;
    case 'exclamation': return <ExclamationIcon  color={color} size={size} />;
    case 'square':      return <SquareIcon       color={color} size={size} />;
    case 'diamond':     return <DiamondIcon      color={color} size={size} />;
    case 'checkmark':   return <CheckmarkIcon    color={color} size={size} />;
    default:            return null;
  }
}
