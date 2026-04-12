import React from 'react';

export interface CameraIconProps {
  color?: string;
  size?: number;
  animated?: boolean;
}

export const CameraIcon: React.FC<CameraIconProps> = ({
  color = '#ffffff',
  size = 100,
  animated = false,
}) => {
  const scale = size / 45;
  const stroke = Math.max(1.5, 2.5 * scale);

  const outerSize = 32 * scale;
  const innerSize = 12 * scale;
  const glintSize = 4 * scale;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        color: color,
        position: 'absolute',
        opacity: animated ? 1 : 0.4,
        top: '10%'
      }}
    >
      <style>{`
        @keyframes cam-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .cam-rec-badge {
          animation: cam-blink 2.5s infinite;
        }
      `}</style>

      {/* Lens outer ring */}
      <div style={{
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        border: `${stroke}px solid ${color}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Lens inner ring */}
        <div style={{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          border: `${Math.max(1, 1.5 * scale)}px solid ${color}`,
          borderRadius: '50%',
        }} />

        {/* Glint — only when active */}
        {/* {animated && ( */}
        {(
          <div style={{
            position: 'absolute',
            top: `${5 * scale}px`,
            right: `${5 * scale}px`,
            width: `${glintSize}px`,
            height: `${glintSize}px`,
            background: 'white',
            borderRadius: '50%',
            opacity: 0.6,
          }} />
        )}
      </div>

      {/* REC badge — only when active */}
      {animated && (
        <div
          className="cam-rec-badge"
          style={{
            position: 'absolute',
            bottom: `${0 * scale}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff3131',
            color: '#ffffff',
            fontSize: `${Math.max(6, 7 * scale)}px`,
            fontWeight: 800,
            letterSpacing: '0.5px',
            padding: `${1 * scale}px ${5 * scale}px`,
            borderRadius: `${2 * scale}px`,
          }}
        >
          REC
        </div>
      )}
    </div>
  );
};