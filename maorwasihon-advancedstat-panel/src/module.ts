import { PanelPlugin, ReducerID, standardEditorsRegistry } from '@grafana/data';
import {
  BigValueColorMode,
  BigValueJustifyMode,
  BigValueTextMode,
} from '@grafana/schema';

import { StatAdvancedPanel } from './StatAdvancedPanel';
import { defaultOptions, FONT_OPTIONS, StatAdvancedOptions } from './types';
import { ImageOverlayEditor } from './ImageOverlayEditor';
// import { SvgIconMappingsEditor } from './SvgIconMappingsEditor';

export const plugin = new PanelPlugin<StatAdvancedOptions>(StatAdvancedPanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    const mainCategory = ['Stat styles'];
    const valueOptions = ['Value options'];
    const backgroundCategory = ['🖼️ Background'];
    const borderCategory = ['🔲 Border & shadow'];
    const fontCategory = ['📝 Text'];
    const innerTitleCategory = ['{ } Headline'];
    const footerCategory = ['{ } Footer'];
    const debuggingCategory = ['🕵️ Debugging'];
    const imageCategory = ['🖼️ Image Overlay'];
    // const svgIconCategory = ['✦ Status Icons'];

    // List of available images in the img folder
    const AVAILABLE_IMAGES = [
      'icn-singlestat-panel.svg',
      'antena.svg',
      'bullet-camera.svg',
      'camera-fill.svg',
      'camera.svg',
      'dome-camera.svg',
      'intercom.svg',
      'pc.svg',
      'plane-a.svg',
      'plane-b.svg',
      'satelite.svg',
      'server-a.svg',
      'server-b.svg',
      'server-c.svg',
      'server-d.svg',
      'video-record-fill.svg',
      'video-record.gif',
      'video-record.svg',
      'video.svg',
      'vmware-a.svg',
      'vmware-b.svg',
      'vmware-c.svg',
      'workstation.svg',
      // Add more images as you add them to the img folder
    ];

    // Wrapper component for the custom editor
    const ImageOverlayEditorWrapper = (props: any) => {
      const React = require('react');
      return React.createElement(ImageOverlayEditor, {
        value: props.value,
        onChange: props.onChange,
        availableImages: AVAILABLE_IMAGES,
      });
    };

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
    .addRadio({
      path: 'innerTitleWeight',
      name: 'Title weight',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleWeight,
      settings: {
          options: [
            { value: 'regular', label: 'Regular' },
            { value: 'bold',    label: 'Bold'    },
          ],
      },
    })
    // Text Color Mode
    .addRadio({
      path: 'innerTitleTextColorMode',
      name: 'Title text color mode',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleTextColorMode,
      settings: {
        options: [
          { value: 'fixed', label: 'Fixed' },
          { value: 'threshold', label: 'Threshold' },
        ],
      },
    })
    // Text Color
    .addColorPicker({
      path: 'innerTitleTextColor',
      name: 'Title text color',
      category: innerTitleCategory,
      defaultValue: defaultOptions.innerTitleTextColor,
      showIf: (config) => config.innerTitleTextColorMode === 'fixed',
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


  // Footer Title
  builder
    // textbox
    .addTextInput({
      path: 'footerTitleText',
      name: 'Title text (inside card)',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleText,
    })
    // font
    .addSelect({
      path: 'footerTitleFont',
      name: 'Title font',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleFont,
      settings: {
        options: [...FONT_OPTIONS],
      },
    })
    // size 
    .addSliderInput({
      path: 'footerTitleSize',
      name: 'Title size (px)',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleSize,
      settings: {
        min: 8,
        max: 48,
        step: 1,
      },
    })
    // weight
    .addRadio({
      path: 'footerTitleWeight',
      name: 'Title weight',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleWeight,
      settings: {
          options: [
            { value: 'regular', label: 'Regular' },
            { value: 'bold',    label: 'Bold'    },
          ],
      },
    })
    // Text Color Mode
    .addRadio({
      path: 'footerTitleTextColorMode',
      name: 'Title text color mode',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleTextColorMode,
      settings: {
        options: [
          { value: 'fixed', label: 'Fixed' },
          { value: 'threshold', label: 'Threshold' },
        ],
      },
    })
    // Text Color
    .addColorPicker({
      path: 'footerTitleTextColor',
      name: 'Title text color',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleTextColor,
      showIf: (config) => config.footerTitleTextColorMode === 'fixed',
    })
    // align
    .addSelect({
      path: 'footerTitleAlign',
      name: 'Title alignment',
      category: footerCategory,
      defaultValue: defaultOptions.footerTitleAlign,
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
          { value: 'float', label: 'Float' },
          { value: 'bounce', label: 'Bounce' },
          { value: 'shimmer-sweep', label: 'Shimmer sweep' },
          { value: 'pro-glow', label: '⭐ Pro Glow (pulse + brightness)' },
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
    })
    .addSelect({
      path: 'colorMode',
      name: 'Color mode',
      defaultValue: BigValueColorMode.None,
      category: backgroundCategory,
      settings: {
        options: [
          { value: BigValueColorMode.None, label: 'None' },
          { value: BigValueColorMode.Value, label: 'Value' },
          { value: BigValueColorMode.Background, label: 'Background gradient' },
          { value: BigValueColorMode.BackgroundSolid, label: 'Background solid' },
        ],
      },
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
    .addRadio({
        path: 'fontWeight',
        name: 'Font weight (thin → thick)',
        category: fontCategory,
        defaultValue: defaultOptions.fontWeight,
        settings: {
          options: [
            { value: 'regular', label: 'Regular' },
            { value: 'bold',    label: 'Bold'    },
          ],
        },
    })
    .addSelect({
      path: 'textMode',
      name: 'Text mode',
      description: 'Control if name and value are displayed or just name',
      category: fontCategory,
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
      path: 'justifyMode',
      name: 'Text alignment',
      defaultValue: defaultOptions.justifyMode,
      category: fontCategory,
      settings: {
        options: [
          { value: BigValueJustifyMode.Auto, label: 'Auto' },
          { value: BigValueJustifyMode.Center, label: 'Center' },
        ],
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

    // value options 
    builder
      .addRadio({
        path: 'reduceOptions.values', 
        name: 'Show',
        category: valueOptions,
        defaultValue: false, 
        settings: {
          options: [
            { value: false, label: 'Calculated'},
            { value: true, label: 'All values'},
          ],
        },
      })
      .addNumberInput({
        path: 'reduceOptions.limit', 
        name: 'Limit', 
        category: valueOptions,
        defaultValue: 25,
        showIf: (options) => options.reduceOptions.values === true,
      })
      .addCustomEditor({
        id: 'reduceOptions.calcs',
        path: 'reduceOptions.calcs',
        name: 'Calculation',
        category: valueOptions,
        editor: standardEditorsRegistry.get('stats-picker').editor as any,
        defaultValue: [ReducerID.lastNotNull],
        showIf: (options) => !options.reduceOptions.values,
      })
      .addCustomEditor({
        id: 'reduceOptions.fields',
        path: 'reduceOptions.fields',
        name: 'Fields',
        category: valueOptions,
        editor: standardEditorsRegistry.get('field-name').editor as any,
        defaultValue: '',
      });

    // Image Overlay
    builder
      .addBooleanSwitch({
        path: 'enableImageOverlay',
        name: 'Enable image overlay',
        category: imageCategory,
        defaultValue: defaultOptions.enableImageOverlay,
      })
      .addCustomEditor({
        id: 'imageOverlay',
        path: 'imageOverlay',
        name: 'Image settings',
        category: imageCategory,
        editor: ImageOverlayEditorWrapper,
        defaultValue: defaultOptions.imageOverlay,
        showIf: (config) => config.enableImageOverlay === true,
      });

   // Text / layout
    builder
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

  });