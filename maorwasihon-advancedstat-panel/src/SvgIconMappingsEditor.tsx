import React from 'react';
import { SvgIconType, SVG_ICON_OPTIONS, SvgIcon } from './svgIcons';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SvgIconMapping {
  /** CSS color that must match the current threshold/value color */
  color: string;
  iconType: SvgIconType;
  /** Icon size in px */
  size: number;
  /** Horizontal offset from the anchor (0 = left edge, 100 = right edge) */
  positionX: number;
  /** Vertical offset from the anchor (0 = top edge, 100 = bottom edge) */
  positionY: number;
}

interface Props {
  value: SvgIconMapping[];
  onChange: (mappings: SvgIconMapping[]) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

function emptyMapping(): SvgIconMapping {
  return {
    color: '#ff0000',
    iconType: 'warning',
    size: 32,
    positionX: 90,
    positionY: 10,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared micro-styles (all inline – no external stylesheet dependency)
// ─────────────────────────────────────────────────────────────────────────────

const css = {
  row: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    padding: '10px 12px',
    marginBottom: 8,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 2,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    color: '#fff',
    padding: '4px 8px',
    fontSize: 12,
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    background: '#1a1c22',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    color: '#fff',
    padding: '4px 8px',
    fontSize: 12,
    boxSizing: 'border-box' as const,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  removeBtn: {
    marginTop: 4,
    padding: '3px 10px',
    background: 'rgba(255,60,0,0.15)',
    border: '1px solid rgba(255,60,0,0.4)',
    borderRadius: 4,
    color: '#ff6040',
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  addBtn: {
    width: '100%',
    padding: '6px 0',
    background: 'rgba(0,243,255,0.07)',
    border: '1px solid rgba(0,243,255,0.3)',
    borderRadius: 5,
    color: '#00f3ff',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  previewWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SvgIconMappingsEditor({ value, onChange }: Props) {
  const mappings: SvgIconMapping[] = Array.isArray(value) ? value : [];

  function update(index: number, patch: Partial<SvgIconMapping>) {
    const next = mappings.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onChange(next);
  }

  function add() {
    onChange([...mappings, emptyMapping()]);
  }

  function remove(index: number) {
    onChange(mappings.filter((_, i) => i !== index));
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {mappings.length === 0 && (
        <div style={{ ...css.label, marginBottom: 10, textAlign: 'center' }}>
          No icon mappings yet. Add one below.
        </div>
      )}

      {mappings.map((m, i) => (
        <div key={i} style={css.row}>
          {/* Header row: preview + index */}
          <div style={css.previewWrap}>
            <SvgIcon type={m.iconType} color={m.color} size={28} />
            <span style={{ ...css.label, marginBottom: 0 }}>Mapping #{i + 1}</span>
          </div>

          {/* Threshold color */}
          <div>
            <div style={css.label}>Threshold color (hex or CSS)</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="color"
                value={m.color.startsWith('#') ? m.color : '#ff0000'}
                onChange={(e) => update(i, { color: e.target.value })}
                style={{ width: 32, height: 28, padding: 2, border: 'none', background: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={m.color}
                onChange={(e) => update(i, { color: e.target.value })}
                style={{ ...css.input, flex: 1 }}
                placeholder="#ff0000 or rgba(255,0,0,1)"
              />
            </div>
          </div>

          {/* Icon type */}
          <div>
            <div style={css.label}>Icon type</div>
            <select
              value={m.iconType}
              onChange={(e) => update(i, { iconType: e.target.value as SvgIconType })}
              style={css.select}
            >
              {SVG_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <div style={css.label}>Size: {m.size} px</div>
            <input
              type="range"
              min={12} max={80} step={2}
              value={m.size}
              onChange={(e) => update(i, { size: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Position */}
          <div style={css.grid2}>
            <div>
              <div style={css.label}>Position X: {m.positionX}%</div>
              <input
                type="range"
                min={0} max={100} step={1}
                value={m.positionX}
                onChange={(e) => update(i, { positionX: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <div style={css.label}>Position Y: {m.positionY}%</div>
              <input
                type="range"
                min={0} max={100} step={1}
                value={m.positionY}
                onChange={(e) => update(i, { positionY: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button style={css.removeBtn} onClick={() => remove(i)}>✕ Remove</button>
        </div>
      ))}

      <button style={css.addBtn} onClick={add}>＋ Add icon mapping</button>
    </div>
  );
}
