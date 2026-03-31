import React from 'react';
import { IconMappingRule } from './types';
import { ICON_OPTIONS } from './iconRegistry';

interface IconMappingsEditorProps {
  value?: IconMappingRule[];
  onChange: (value: IconMappingRule[]) => void;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
};

const selectStyle: React.CSSProperties = {
  background: 'var(--colors-bg-secondary, #2a2a2a)',
  color: 'var(--colors-text-primary, #ccc)',
  border: '1px solid var(--colors-border-weak, #444)',
  borderRadius: 4,
  padding: '4px 6px',
  fontSize: 12,
};

const inputStyle: React.CSSProperties = {
  ...selectStyle,
  width: 80,
};

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--colors-border-weak, #444)',
  borderRadius: 4,
  color: 'var(--colors-text-secondary, #999)',
  cursor: 'pointer',
  padding: '2px 8px',
  fontSize: 12,
};

export const IconMappingsEditor: React.FC<IconMappingsEditorProps> = ({ value = [], onChange }) => {
  const update = (index: number, patch: Partial<IconMappingRule>) => {
    const next = value.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([
      ...value,
      { type: 'exact', exactValue: '', iconId: ICON_OPTIONS[0]?.value ?? '' },
    ]);
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {value.map((rule, i) => (
        <div key={i} style={rowStyle}>
          {/* Match type */}
          <select
            style={selectStyle}
            value={rule.type}
            onChange={(e) => update(i, { type: e.target.value as IconMappingRule['type'] })}
          >
            <option value="exact">Exact</option>
            <option value="threshold">Threshold</option>
          </select>

          {/* Value input — only for exact */}
          {rule.type === 'exact' && (
            <input
              style={inputStyle}
              placeholder="value"
              value={rule.exactValue ?? ''}
              onChange={(e) => update(i, { exactValue: e.target.value })}
            />
          )}

          {/* Icon picker */}
          <select
            style={{ ...selectStyle, flex: 1 }}
            value={rule.iconId}
            onChange={(e) => update(i, { iconId: e.target.value })}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Remove */}
          <button style={btnStyle} onClick={() => remove(i)}>✕</button>
        </div>
      ))}

      <button style={{ ...btnStyle, marginTop: 4 }} onClick={add}>
        + Add mapping
      </button>
    </div>
  );
};