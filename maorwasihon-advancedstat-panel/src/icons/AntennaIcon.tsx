import React from 'react';

export interface AntennaIconProps {
  color?: string;
  size?: number;
  animated?: boolean;
}

export const AntennaIcon: React.FC<AntennaIconProps> = ({
  color = '#ff5e00',
  size = 80,
  animated = false,
}) => {
  // Antenna proportions: 30x35 from original, we scale to size
  const scale = size / 35;
  const poleWidth = Math.max(2, 3 * scale);
  const poleHeight = 14 * scale;
  const poleMarginTop = 14 * scale;
  const wrapWidth = size;
  const wrapHeight = size;

  return (
    <div
      className="antenna-wrapper"
      style={{
        width: `${wrapWidth}px`,
        height: `${wrapHeight}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        color: color,
      }}
    >
      <style>{`
        @keyframes antenna-wave-spread {
        0%   { transform: translateX(-50%) scale(1.5); opacity: 0; }
        10%  { opacity: 1; }
        80% { transform: translateX(-50%) scale(1.5); opacity: 0; }
        }

        .antenna-w1 { animation-delay: 0s; }
        .antenna-w2 { animation-delay: 0.5s; }
        .antenna-w3 { animation-delay: 1s; }
        .antenna-w4 { animation-delay: 1.5s; }
      `}</style>

      {/* Outer container: pole + waves */}
      <div style={{
        width: `${30 * scale}px`,
        height: `${35 * scale}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Waves */}
       {[
          { size: 5 * scale, delay: '0s' },
          { size: 10 * scale, delay: '0.5s' },
          { size: 15 * scale, delay: '1s' },
          { size: 20 * scale, delay: '1.5s' },
        ].map(({ size: wSize, delay }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 15,
              left: '50%',
              width: `${wSize}px`,
              height: `${wSize}px`,
              borderTop: `${Math.max(2, 1 * scale)}px solid ${color}`,
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderRadius: '0%',
              opacity: animated ? 0 : 1,
              transform: animated ? 'translateX(-50%) scale(0.2)' : 'translateX(-50%) scale(1)',
              animation: animated
                ? `antenna-wave-spread 2.5s ${delay} infinite linear`
                : 'none',
            }}
          />
        ))}

        {/* Pole */}
        <div style={{
          width: `${poleWidth}px`,
          height: `${poleHeight}px`,
          background: color,
          marginTop: `${poleMarginTop}px`,
          flexShrink: 0,
        }} />
      </div>
    </div>
  );
};