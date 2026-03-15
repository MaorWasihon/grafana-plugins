import { PanelPlugin } from '@grafana/data';
import {
  BigValueColorMode,
  BigValueGraphMode,
  BigValueJustifyMode,
  BigValueTextMode,
  PercentChangeColorMode,
} from '@grafana/schema';

import { StatAdvancedPanel } from './StatAdvancedPanel';
import { defaultOptions, FONT_OPTIONS, StatAdvancedOptions } from './types';

export const plugin = new PanelPlugin<StatAdvancedOptions>(StatAdvancedPanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    const mainCategory = ['Stat styles'];
    const backgroundCategory = ['🖼️ Background'];
    const borderCategory = ['🔲 Border & shadow'];
    const fontCategory = ['📝 Typography'];
    const innerTitleCategory = ['{ } Headline'];
    const debuggingCategory = ['🕵️ Debugging'];



  // InnerTitle
  builder
    // textbox
    .addTextInput({
      path: 'innerTitleText',
      name: 'Title text (inside card)',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleText,
    })
    // font
    .addSelect({
      path: 'innerTitleFont',
      name: 'Title font',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleFont,
      settings: {
        options: [...FONT_OPTIONS],
      },
    })
    // size 
    .addSliderInput({
      path: 'innerTitleSize',
      name: 'Title size (px)',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleSize,
      settings: {
        min: 8,
        max: 48,
        step: 1,
      },
    })
    // weight
    .addSliderInput({
      path: 'innerTitleWeight',
      name: 'Title weight',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleWeight,
      settings: {
        min: 300,
        max: 900,
        step: 100,
      },
    })
    // align
    .addSelect({
      path: 'innerTitleAlign',
      name: 'Title alignment',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleAlign,
      settings: {
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
    });


    // Background – only opacity now, color comes from thresholds
    builder
    .addSliderInput({
      path: 'backgroundOpacity',
      name: 'Background opacity',
      category: backgroundCategory,
      defaultValue: defaultOptions.backgroundOpacity,
      settings: {
        min: 0,
        max: 100,
        step: 5,
      },
    })
    .addSliderInput({
        path: 'panelPadding',
        name: 'Inner padding (px)',
        category: backgroundCategory,
        defaultValue: defaultOptions.panelPadding,
        settings: {
        min: 0,
        max: 32,
        step: 1,
        },
    })
    .addSelect({
      path: 'backgroundAnimation',
      name: 'Background animation',
      category: backgroundCategory,
      defaultValue: defaultOptions.backgroundAnimation,
      settings: {
        options: [
          { value: 'none', label: 'None' },
          { value: 'pulse', label: 'Soft pulse' },
          { value: 'glow', label: 'Glow' },
          { value: 'glass-shimmer', label: 'Glass shimmer' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'enableScanlines',
      name: 'Scanlines overlay',
      category: backgroundCategory,
      defaultValue: defaultOptions.enableScanlines,
    })
    .addBooleanSwitch({
      path: 'enableHoverHighlight',
      name: 'Hover edge highlight',
      category: backgroundCategory,
      defaultValue: defaultOptions.enableHoverHighlight,
    });


    // Border & shadow
    builder
      .addSliderInput({
        path: 'borderRadius',
        name: 'Border radius (%)',
        category: borderCategory,
        defaultValue: defaultOptions.borderRadius,
        settings: {
          min: 0,
          max: 50,
          step: 1,
        },
      })
      .addSliderInput({
        path: 'borderWidth',
        name: 'Border width (px)',
        category: borderCategory,
        defaultValue: defaultOptions.borderWidth,
        settings: {
          min: 0,
          max: 10,
          step: 1,
        },
      })
      .addColorPicker({
        path: 'borderColor',
        name: 'Border color',
        category: borderCategory,
        defaultValue: defaultOptions.borderColor,
        showIf: (config) => config.borderWidth > 0,
      })
      .addSelect({
        path: 'boxShadow',
        name: 'Shadow',
        category: borderCategory,
        defaultValue: defaultOptions.boxShadow,
        settings: {
          options: [
            { value: 'none', label: 'None' },
            { value: 'soft', label: 'Soft' },
            { value: 'strong', label: 'Strong' },
            { value: 'shine', label: 'Shine' },
          ],
        },
      });

    // Typography
    builder
    .addSelect({
      path: 'fontChoice',
      name: 'Font',
      category: fontCategory,
      defaultValue: defaultOptions.fontChoice,
      settings: {
        options: [...FONT_OPTIONS],
      },
    })
    .addSliderInput({
        path: 'textSize',
        name: 'Text size (px)',
        category: fontCategory,
        defaultValue: defaultOptions.textSize,
        settings: {
          min: 12,
          max: 200,
          step: 1,
        },
    })
    .addSliderInput({
        path: 'fontWeight',
        name: 'Font weight (thin → thick)',
        category: fontCategory,
        defaultValue: defaultOptions.fontWeight,
        settings: {
          min: 300,
          max: 900,
          step: 100,
        },
    });

  // debug
  builder
    .addBooleanSwitch({
      path: 'debugOutline', 
      name: 'Debug outlines', 
      category: debuggingCategory, 
      defaultValue: defaultOptions.debugOutline,
    });
  
   // Text / layout
    builder
      .addSelect({
        path: 'textMode',
        name: 'Text mode',
        description: 'Control if name and value are displayed or just name',
        category: mainCategory,
        settings: {
          options: [
            { value: BigValueTextMode.Auto, label: 'Auto' },
            { value: BigValueTextMode.Value, label: 'Value' },
            { value: BigValueTextMode.ValueAndName, label: 'Value and name' },
            { value: BigValueTextMode.Name, label: 'Name' },
            { value: BigValueTextMode.None, label: 'None' },
          ],
        },
        defaultValue: defaultOptions.textMode,
      })
      .addRadio({
        path: 'wideLayout',
        name: 'Wide layout',
        category: mainCategory,
        settings: {
          options: [
            { value: true, label: 'On' },
            { value: false, label: 'Off' },
          ],
        },
        defaultValue: defaultOptions.wideLayout,
        showIf: (config) => config.textMode === BigValueTextMode.ValueAndName,
      });

    // Color / graph / alignment / percent change
    builder
      .addSelect({
        path: 'colorMode',
        name: 'Color mode',
        defaultValue: BigValueColorMode.Value,
        category: mainCategory,
        settings: {
          options: [
            { value: BigValueColorMode.None, label: 'None' },
            { value: BigValueColorMode.Value, label: 'Value' },
            { value: BigValueColorMode.Background, label: 'Background gradient' },
            { value: BigValueColorMode.BackgroundSolid, label: 'Background solid' },
          ],
        },
      })
      .addRadio({
        path: 'graphMode',
        name: 'Graph mode',
        description: 'Stat panel graph / sparkline mode',
        category: mainCategory,
        defaultValue: defaultOptions.graphMode,
        settings: {
          options: [
            { value: BigValueGraphMode.None, label: 'None' },
            { value: BigValueGraphMode.Area, label: 'Area' },
          ],
        },
      })
      .addRadio({
        path: 'justifyMode',
        name: 'Text alignment',
        defaultValue: defaultOptions.justifyMode,
        category: mainCategory,
        settings: {
          options: [
            { value: BigValueJustifyMode.Auto, label: 'Auto' },
            { value: BigValueJustifyMode.Center, label: 'Center' },
          ],
        },
      })
      .addBooleanSwitch({
        path: 'showPercentChange',
        name: 'Show percent change',
        defaultValue: defaultOptions.showPercentChange,
        category: mainCategory,
      })
      .addSelect({
        path: 'percentChangeColorMode',
        name: 'Percent change color mode',
        defaultValue: defaultOptions.percentChangeColorMode,
        category: mainCategory,
        settings: {
          options: [
            { value: PercentChangeColorMode.Standard, label: 'Standard' },
            { value: PercentChangeColorMode.Inverted, label: 'Inverted' },
            { value: PercentChangeColorMode.SameAsValue, label: 'Same as value' },
          ],
        },
        showIf: (config) => config.showPercentChange,
      });

    // Orientation (string options, we map in the panel)
    builder.addRadio({
      path: 'orientation',
      name: 'Orientation',
      category: mainCategory,
      defaultValue: defaultOptions.orientation,
      settings: {
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
    });
  });
