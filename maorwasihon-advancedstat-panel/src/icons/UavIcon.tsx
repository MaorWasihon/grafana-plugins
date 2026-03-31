import React from 'react';

export interface UavIconProps {
  color?: string;
  size?: number;
  animated?: boolean;
}

export const UavIcon: React.FC<UavIconProps> = ({ 
  color = '#00f3ff', 
  size = 100, 
  animated = false 
}) => {
  // We calculate dimensions based on your 48x24 ratio (2:1)
  const width = size;
  const height = size / 2;

  return (
    <div className="uav-wrapper" style={{
      width: `${width}px`,
      height: `${height}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      color: color, // Set current color for children to use 'currentColor'
    }}>
      {/* We inject the CSS for animations directly into a style tag. 
        This avoids needing a separate CSS file or a library.
      */}
      <style>{`
        @keyframes uav-sweep-v { 
          0% { top: -20%; opacity: 0; } 
          50% { opacity: 1; } 
          100% { top: 100%; opacity: 0; } 
        }

        @keyframes uav-breath {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 2px ${color}); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px ${color}); }
        }

        .uav-shape-inner {
          width: 100%;
          height: 100%;
          background: currentColor;
          clip-path: polygon(50% 0, 100% 100%, 50% 50%, 0 100%);
          position: relative;
          overflow: hidden;
          ${animated ? `animation: uav-breath 3s infinite ease-in-out;` : ''}
        }

        .uav-scanner {
          position: absolute;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 8px #fff;
          animation: uav-sweep-v 1.5s infinite linear;
          z-index: 10;
        }

        .uav-wrapper:hover .uav-shape-inner {
          animation-duration: 1s;
        }
      `}</style>

      <div className="uav-shape-inner">
        {animated && <div className="uav-scanner" />}
      </div>
    </div>
  );
};