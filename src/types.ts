import {
  BigValueColorMode,
  BigValueGraphMode,
  BigValueJustifyMode,
  BigValueTextMode,
  PercentChangeColorMode,
} from '@grafana/schema';
import { ReduceDataOptions } from '@grafana/data';

export type BackgroundGradientDirection = 'vertical' | 'horizontal' | 'diagonal';
export type BackgroundImageFit = 'cover' | 'contain';
export type BackgroundAnimation = 'none' | 'pulse' | 'glow' | 'glass-shimmer';

// Orientation used only in our options (we map it in the panel)
export type OrientationOption = 'auto' | 'horizontal' | 'vertical';

// InnerTitle
export type InnerTitleAlign = 'left' | 'center' | 'right'

// font weight 
export type FontWeightOption = 'regular' | 'bold'

// Fonts
export type FontChoice = 
  | 'inherit'
  | 'system-ui'
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'roboto-mono'
  | 'arial'
  | 'helvetica'
  | 'georgia'
  | 'times'
  | 'verdana'
  | 'courier';

// types.ts  (add near the FontChoice type)
export const FONT_OPTIONS: Array<{ value: FontChoice; label: string; css: string | undefined }> = [
  { value: 'inherit',     label: 'Inherit (Grafana theme)', css: undefined },
  { value: 'system-ui',   label: 'System UI',               css: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { value: 'sans-serif',  label: 'Sans-serif',              css: 'sans-serif' },
  { value: 'serif',       label: 'Serif',                   css: 'serif' },
  { value: 'monospace',   label: 'Monospace',               css: 'monospace' },
  { value: 'roboto-mono', label: 'Roboto Mono',             css: '"Roboto Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
  { value: 'arial',       label: 'Arial',                   css: 'Arial, Helvetica, sans-serif' },
  { value: 'helvetica',   label: 'Helvetica',               css: 'Helvetica, Arial, sans-serif' },
  { value: 'georgia',     label: 'Georgia',                 css: 'Georgia, "Times New Roman", serif' },
  { value: 'times',       label: 'Times New Roman',         css: '"Times New Roman", Times, serif' },
  { value: 'verdana',     label: 'Verdana',                 css: 'Verdana, Geneva, sans-serif' },
  { value: 'courier',     label: 'Courier New',             css: '"Courier New", Courier, monospace' },
];



export type BoxShadowPreset = 'none' | 'soft' | 'strong' | 'shine';

export interface StatAdvancedOptions {
  // Core Stat-like options
  textMode: BigValueTextMode;
  wideLayout: boolean;
  colorMode: BigValueColorMode;
  graphMode: BigValueGraphMode;
  justifyMode: BigValueJustifyMode;
  showPercentChange: boolean;
  percentChangeColorMode: PercentChangeColorMode;
  orientation: OrientationOption;
  reduceOptions: ReduceDataOptions;

  // Background styling (we mainly use opacity over threshold color)
  backgroundOpacity: number; // 0–100
  backgroundAnimation: BackgroundAnimation; // 0–100
  enableHoverHighlight: boolean;
  enableGrainTexture: boolean;
  enableFrostedGlass: boolean;
  enableScanlines: boolean;
  // layout 
  panelPadding: number; // px

  // Border + shadow
  borderRadius: number; // 0–50 (%)
  borderWidth: number;  // px
  borderColor?: string;
  boxShadow: BoxShadowPreset;

  // Typography
  textSize: number; //px 12-72 
  fontWeight: FontWeightOption; // 400-1000 (thin to thick)
  fontChoice: FontChoice;

  // Inner title options
  innerTitleText?: string;
  innerTitleFont: FontChoice;
  innerTitleSize: number;
  innerTitleWeight: FontWeightOption;
  innerTitleAlign: InnerTitleAlign;

  // debug 
  debugOutline: boolean;
}

export const defaultOptions: StatAdvancedOptions = {
  // Stat defaults
  textMode: BigValueTextMode.Auto,
  wideLayout: true,
  colorMode: BigValueColorMode.Value,
  graphMode: BigValueGraphMode.None,
  justifyMode: BigValueJustifyMode.Center,
  showPercentChange: false,
  percentChangeColorMode: PercentChangeColorMode.Standard,
  orientation: 'auto',
  reduceOptions: {
    calcs: ['lastNotNull'],
    fields: '',
    values: false,
    limit: 1,
  },

  // Background
  backgroundOpacity: 100, // percent
  backgroundAnimation: 'none',
  enableHoverHighlight: true,
  enableGrainTexture: false,
  enableFrostedGlass: false,
  enableScanlines: false,

  // layout 
  panelPadding: 8,
  
  // Border + shadow
  borderRadius: 0,
  borderWidth: 0,
  borderColor: '#ffffff',
  boxShadow: 'none',

  // Typography
  fontChoice: 'inherit',
  textSize: 40, 
  fontWeight: 'regular', 

  // InnerTitle
  innerTitleText: '',
  innerTitleFont: 'inherit',
  innerTitleSize: 14,
  innerTitleWeight: 'regular',
  innerTitleAlign: 'center',

  // debug 
  debugOutline: false,
};
