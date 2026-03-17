import { isNumber } from 'lodash';
import React, { memo, useCallback, type JSX, useMemo } from 'react';

import {
  DisplayValueAlignmentFactors,
  FieldDisplay,
  FieldType,
  getDisplayValueAlignmentFactors,
  getFieldDisplayValues,
  NumericRange,
  PanelProps,
} from '@grafana/data';
import { BigValueTextMode, BigValueGraphMode, VizTextDisplayOptions } from '@grafana/schema';
import { BigValue, DataLinksContextMenu, useTheme2, VizRepeater, VizRepeaterRenderValueProps } from '@grafana/ui';

import { StatAdvancedOptions, defaultOptions } from './types';
import { getContainerStyle, mapFontChoice, mapFontWeight } from './styles';
import  './styles.css';

// Import images for overlay
import iconSinglestat from './img/icn-singlestat-panel.svg';
import iconAntena from './img/antena.svg';
import iconBulletCamera from './img/bullet-camera.svg';
import iconCameraFill from './img/camera-fill.svg';
import iconCamera from './img/camera.svg';
import iconDomeCamera from './img/dome-camera.svg';
import iconIntercom from './img/intercom.svg';
import iconPc from './img/pc.svg';
import iconPlaneA from './img/plane-a.svg';
import iconPlaneB from './img/plane-b.svg';
import iconSatelite from './img/satelite.svg';
import iconServerA from './img/server-a.svg';
import iconServerB from './img/server-b.svg';
import iconServerC from './img/server-c.svg';
import iconServerD from './img/server-d.svg';
import iconVideoRecordFill from './img/video-record-fill.svg';
import iconVideoRecordGif from './img/video-record.gif';
import iconVideoRecord from './img/video-record.svg';
import iconVideo from './img/video.svg';
import iconVMWareA from './img/vmware-a.svg';
import iconVMWareB from './img/vmware-b.svg';
import iconVMWareC from './img/vmware-c.svg';
import iconWorkstation from './img/workstation.svg';

// Image map - add your images here
const IMAGE_MAP: Record<string, string> = {
  'icn-singlestat-panel.svg': iconSinglestat,
  'antena.svg': iconAntena,
  'bullet-camera.svg': iconBulletCamera,
  'camera-fill.svg': iconCameraFill,
  'camera.svg': iconCamera,
  'dome-camera.svg': iconDomeCamera,
  'intercom.svg': iconIntercom,
  'pc.svg': iconPc,
  'plane-a.svg': iconPlaneA,
  'plane-b.svg': iconPlaneB,
  'satelite.svg': iconSatelite,
  'server-a.svg': iconServerA,
  'server-b.svg': iconServerB,
  'server-c.svg': iconServerC,
  'server-d.svg': iconServerD,
  'video-record-fill.svg': iconVideoRecordFill,
  'video-record.gif': iconVideoRecordGif,
  'video-record.svg': iconVideoRecord,
  'video.svg': iconVideo,
  'vmware-a.svg': iconVMWareA,
  'vmware-b.svg': iconVMWareB,
  'vmware-c.svg': iconVMWareC,
  'workstation.svg': iconWorkstation,
};

type Props = PanelProps<StatAdvancedOptions>;

export const StatAdvancedPanel = memo((props: Props) => {
  const { timeRange, options, fieldConfig, title, data, replaceVariables, timeZone, height, width, renderCounter } =
    props;

  // Merge with defaults so we always have full options
  const fullOptions: StatAdvancedOptions = {
    ...defaultOptions,
    ...options,
  };

  const theme = useTheme2();

  const getTextMode = useCallback(() => {
    if (fullOptions.textMode === BigValueTextMode.Auto && (fieldConfig.defaults.displayName || !title)) {
      return BigValueTextMode.ValueAndName;
    }

    return fullOptions.textMode;
  }, [fullOptions.textMode, fieldConfig.defaults.displayName, title]);

  const getValues = useCallback((): FieldDisplay[] => {
    let globalRange: NumericRange | undefined = undefined;

    for (const frame of data.series) {
      for (const field of frame.fields) {
        const { config } = field;

        if (field.type === FieldType.number) {
          if (field.state?.range) {
            continue;
          }

          if (!globalRange && (!isNumber(config.min) || !isNumber(config.max))) {
            let min: number | undefined;
            let max: number | undefined;

            for (const series of data.series) {
              for (const f of series.fields) {
                if (f.type !== FieldType.number) {
                  continue;
                }

                for (const v of f.values) {
                  const value = Number(v);
                  if (!isFinite(value)) {
                    continue;
                  }
                  if (min === undefined || value < min) {
                    min = value;
                  }
                  if (max === undefined || value > max) {
                    max = value;
                  }
                }
              }
            }

            globalRange = {
              min,
              max,
              delta: max !== undefined && min !== undefined ? max - min : 0,
            };
          }

          const min = (config.min ?? globalRange?.min) ?? null;
          const max = (config.max ?? globalRange?.max) ?? null;
          if (min == null || max == null) {
            continue;
          }

          field.state = field.state ?? {};
          field.state.range = { min, max, delta: max - min };
        }
      }
    }

    return getFieldDisplayValues({
      fieldConfig,
      reduceOptions: fullOptions.reduceOptions,
      replaceVariables,
      theme,
      data: data.series,
      sparkline: fullOptions.graphMode !== BigValueGraphMode.None,
      percentChange: fullOptions.showPercentChange,
      timeZone,
    });
  }, [
    data,
    fieldConfig,
    theme,
    fullOptions.reduceOptions,
    fullOptions.graphMode,
    fullOptions.showPercentChange,
    replaceVariables,
    timeZone,
  ]);

  const getTextDisplayOptions = useCallback(
    (): VizTextDisplayOptions => {
      const size = Math.max(12, Math.min(200, fullOptions.textSize)); 
      return {
        valueSize: size, 
        titleSize: size * 0.35, 
        percentSize: size * 0.3,
      };
    },
    [fullOptions.textSize]
  );


  const renderComponent = useCallback(
    (
      valueProps: VizRepeaterRenderValueProps<FieldDisplay, DisplayValueAlignmentFactors>,
      menuProps: any
    ): JSX.Element => {
      const { value, alignmentFactors, width: itemWidth, height: itemHeight, count } = valueProps;
      const { openMenu, targetClassName } = menuProps ?? {};

      let sparkline = value.sparkline;
      if (sparkline) {
        sparkline.timeRange = timeRange;
      }


      const weight = mapFontWeight(fullOptions.fontWeight);
      const innerTitleWeight = mapFontWeight(fullOptions.innerTitleWeight);      
      const innerTitleSize = Math.max(8, Math.min(48, fullOptions.innerTitleSize));
      const innerTitleFontFamily = mapFontChoice(fullOptions.innerTitleFont); // you can export mapFontChoice or duplicate logic

      const titleStyle: React.CSSProperties = {
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: innerTitleSize,
        fontWeight: innerTitleWeight,
        fontFamily: innerTitleFontFamily,
        textAlign: fullOptions.innerTitleAlign,
        ...(fullOptions.debugOutline
          ? { border: '3px dotted black' }
          : {}),
      };

      const bodyWrapperStyle: React.CSSProperties = {
        flex: 1,
        minHeight: 0,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...(fullOptions.debugOutline
          ? { border: '3px dotted blue' }
          : {}),
      };

    return (
      <div style={{ 
        fontWeight: weight, 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
        }}
      >
        {fullOptions.innerTitleText && 
          <div style={titleStyle}>{fullOptions.innerTitleText}</div>
        }
        <div style={bodyWrapperStyle}>
          <BigValue
            value={value.display}
            count={count}
            sparkline={sparkline}
            colorMode={fullOptions.colorMode}
            graphMode={fullOptions.graphMode}
            justifyMode={fullOptions.justifyMode}
            textMode={getTextMode()}
            alignmentFactors={alignmentFactors}
            text={getTextDisplayOptions()}
            width={itemWidth}
            height={itemHeight}
            theme={theme}
            onClick={openMenu}
            className={targetClassName}
            disableWideLayout={!fullOptions.wideLayout}
            percentChangeColorMode={fullOptions.percentChangeColorMode}
          />
        </div>
      </div>
    );
    },
    [theme, timeRange, fullOptions, getTextMode, getTextDisplayOptions]
  );

  const renderValue = useCallback(
    (valueProps: VizRepeaterRenderValueProps<FieldDisplay, DisplayValueAlignmentFactors>): JSX.Element => {
      const { value } = valueProps;
      const { getLinks, hasLinks } = value;

      if (hasLinks && getLinks) {
        return (
          <DataLinksContextMenu links={getLinks}>
            {(api) => renderComponent(valueProps, api)}
          </DataLinksContextMenu>
        );
      }

      return renderComponent(valueProps, {});
    },
    [renderComponent]
  );

  // Compute values once so we can read the threshold color
  const values = useMemo(() => getValues(), [getValues]);
  const primaryDisplay = values[0]?.display;
  const thresholdColor = (primaryDisplay?.color as string | undefined) ?? undefined;

  // Build container style from full options + threshold color
  const {style: containerStyle, className: containerClassNameFromStyle } = getContainerStyle(fullOptions, thresholdColor);
  
  const hoverClass = fullOptions.enableHoverHighlight ? 'stat-advanced-hover-edge' : '';
  const combinedClassName = [containerClassNameFromStyle, hoverClass]
    .filter(Boolean)
    .join(' ');
  const pad = Math.max(0, fullOptions.panelPadding ?? 0 ); 
  const innerWidth = Math.max(0, width - pad * 2);
  const innerHeight = Math.max(0, height - pad * 2);

  // Image overlay rendering
  const imageOverlayStyle: React.CSSProperties | undefined = fullOptions.enableImageOverlay && fullOptions.imageOverlay && fullOptions.imageOverlay.imageFileName
    ? (() => {
        const imgPath = IMAGE_MAP[fullOptions.imageOverlay!.imageFileName];
        if (!imgPath) {
          console.warn(`Image not found: ${fullOptions.imageOverlay!.imageFileName}`);
          return undefined;
        }
        return {
          position: 'absolute',
          left: `${fullOptions.imageOverlay!.positionX}%`,
          top: `${fullOptions.imageOverlay!.positionY}%`,
          width: `${fullOptions.imageOverlay!.width}%`,
          height: `${fullOptions.imageOverlay!.height}%`,
          opacity: fullOptions.imageOverlay!.opacity / 100,
          backgroundImage: `url('${imgPath}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: fullOptions.imageOverlay!.zIndex,
          pointerEvents: 'none',
        } as React.CSSProperties;
      })()
    : undefined;

  return (
    <div style={{
        width: '100%',
        height: '100%', 
        boxSizing: 'border-box', 
        padding: fullOptions.panelPadding,
        position: 'relative',
    }}>
        <div className={combinedClassName} style={containerStyle}>
          <VizRepeater
            getValues={() => values}
            getAlignmentFactors={getDisplayValueAlignmentFactors}
            renderValue={renderValue}
            width={innerWidth}
            height={innerHeight}
            source={data}
            itemSpacing={3}
            renderCounter={renderCounter}
            autoGrid={true}
            orientation={
                (fullOptions.orientation === 'auto'
                    ? undefined
                    : fullOptions.orientation
                ) as any
            }
          />
        </div>
        {imageOverlayStyle && <div style={imageOverlayStyle} />}
    </div>
  );
});

StatAdvancedPanel.displayName = 'StatAdvancedPanel';