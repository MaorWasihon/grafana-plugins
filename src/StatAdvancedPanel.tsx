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
import { getContainerStyle, mapFontChoice } from './styles';
import  './styles.css';

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


      const weight = Math.max(300, Math.min(900, fullOptions.fontWeight));
      const innerTitleWeight = Math.max(300, Math.min(900, fullOptions.innerTitleWeight));
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

  return (
    <div style={{
        width: '100%',
        height: '100%', 
        boxSizing: 'border-box', 
        padding: fullOptions.panelPadding,
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
    </div>
  );
});

StatAdvancedPanel.displayName = 'StatAdvancedPanel';
