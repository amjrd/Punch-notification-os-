export type CutoutPosition = 'center' | 'left' | 'right' | 'pill' | 'notch' | 'custom';

export type ScreenState = 'screen_on' | 'aod_black' | 'lock_screen';

export type AnimationEffect = 
  | 'breathing' 
  | 'rotating_sweep' 
  | 'battery_ring' 
  | 'radar_wave' 
  | 'chroma_flow' 
  | 'strobe_alert';

export interface AppNotification {
  id: string;
  packageName: string;
  appName: string;
  appColor: string;
  secondaryColor?: string;
  title: string;
  message: string;
  timestamp: string;
  iconName: string;
  priority: 'high' | 'default' | 'urgent';
}

export interface CutoutGeometry {
  position: CutoutPosition;
  centerX: number; // in dp / px relative to phone top
  centerY: number;
  radius: number;
  width?: number; // for pill
  height?: number; // for pill
  notchDepth?: number; // for notch
}

export interface RingStyleConfig {
  effect: AnimationEffect;
  thickness: number; // stroke width (1 - 12 px)
  offsetPadding: number; // gap from camera cutout edge (0 - 15 px)
  glowBlur: number; // blur radius
  speed: number; // animation duration in seconds
  batteryPercent: number; // 0 - 100 for battery effect
  activeColor: string;
  secondaryColor: string;
  glowEnabled: boolean;
}

export interface ArchitectureComponent {
  id: string;
  titleAr: string;
  titleEn: string;
  badge: string;
  summary: string;
  keyClasses: string[];
  permissions: string[];
  challenges: string[];
  codeSnippet: string;
}
