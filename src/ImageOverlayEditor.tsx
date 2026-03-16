import React, { useState, useRef, useEffect } from 'react';
import { ImageOverlayConfig } from './types';
import './imageEditor.css';

interface ImageOverlayEditorProps {
  value?: ImageOverlayConfig;
  onChange: (value: ImageOverlayConfig) => void;
  availableImages: string[];
}

export const ImageOverlayEditor: React.FC<ImageOverlayEditorProps> = ({
  value,
  onChange,
  availableImages,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeOffset, setResizeOffset] = useState({ width: 0, height: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);

  const config: ImageOverlayConfig = value || {
    imageFileName: '',
    positionX: 50,
    positionY: 50,
    width: 50,
    height: 50,
    opacity: 100,
    zIndex: 1,
  };

  const updateConfig = (updates: Partial<ImageOverlayConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleImageSelect = (fileName: string) => {
    updateConfig({ imageFileName: fileName });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: config.width,
      height: config.height,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isDragging && !isResizing) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;

      const previewRect = previewRef.current.getBoundingClientRect();
      const previewWidth = previewRect.width;
      const previewHeight = previewRect.height;

      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const deltaXPercent = (deltaX / previewWidth) * 100;
        const deltaYPercent = (deltaY / previewHeight) * 100;

        setDragOffset({ x: deltaXPercent, y: deltaYPercent });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;

        const percentDeltaX = (deltaX / previewWidth) * 100;
        const percentDeltaY = (deltaY / previewHeight) * 100;

        setResizeOffset({ width: percentDeltaX, height: percentDeltaY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(100 - config.width, config.positionX + dragOffset.x));
        const newY = Math.max(0, Math.min(100 - config.height, config.positionY + dragOffset.y));
        updateConfig({
          positionX: newX,
          positionY: newY,
        });
        setDragOffset({ x: 0, y: 0 });
      }

      if (isResizing) {
        const newWidth = Math.max(10, Math.min(100, resizeStartRef.current.width + resizeOffset.width));
        const newHeight = Math.max(10, Math.min(100, resizeStartRef.current.height + resizeOffset.height));
        updateConfig({
          width: newWidth,
          height: newHeight,
        });
        setResizeOffset({ width: 0, height: 0 });
      }

      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeOffset, config]);

  return (
    <div className="image-overlay-editor">
      <div className="editor-section">
        <label>Select Image</label>
        <select
          value={config.imageFileName}
          onChange={(e) => handleImageSelect(e.target.value)}
          className="image-select"
        >
          <option value="">-- No image --</option>
          {availableImages.map((img) => (
            <option key={img} value={img}>
              {img}
            </option>
          ))}
        </select>
      </div>

      {config.imageFileName && (
        <>
          <div className="editor-section">
            <label>Drag to position • Resize handle (circle) to resize</label>
            <div className="preview-container" ref={previewRef}>
              <div
                className={`image-box ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
                ref={imageBoxRef}
                style={{
                  left: `${config.positionX}%`,
                  top: `${config.positionY}%`,
                  width: `${config.width + resizeOffset.width}%`,
                  height: `${config.height + resizeOffset.height}%`,
                  opacity: config.opacity / 100,
                  backgroundColor: 'rgba(100, 150, 200, 0.3)',
                  borderRadius: '2px',
                  transform: `translate(${dragOffset.x}%, ${dragOffset.y}%)`,
                  transition: isDragging || isResizing ? 'none' : 'all 0.15s ease',
                  willChange: 'transform',
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '12px',
                  color: '#fff',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  📷 {config.imageFileName}
                </div>
              </div>
            </div>
          </div>

          <div className="editor-controls">
            <div className="control-group">
              <label>Opacity (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.opacity}
                onChange={(e) => updateConfig({ opacity: parseFloat(e.target.value) })}
                className="slider"
              />
              <span className="value">{Math.round(config.opacity)}%</span>
            </div>

            <div className="control-group">
              <label>Z-Index</label>
              <input
                type="number"
                min="1"
                max="100"
                value={config.zIndex}
                onChange={(e) => updateConfig({ zIndex: parseInt(e.target.value, 10) })}
                className="number-input"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};