import React from 'react';
import { RingStyleConfig, AnimationEffect, ScreenState } from '../types';
import { 
  Sparkles, 
  RotateCw, 
  Wind, 
  BatteryCharging, 
  Radio, 
  Rainbow, 
  Zap, 
  Sliders,
  Moon,
  Smartphone,
  Lock
} from 'lucide-react';

interface EffectCustomizerBarProps {
  ringConfig: RingStyleConfig;
  screenState: ScreenState;
  onChangeRingConfig: (updater: (prev: RingStyleConfig) => RingStyleConfig) => void;
  onChangeScreenState: (state: ScreenState) => void;
}

export const EffectCustomizerBar: React.FC<EffectCustomizerBarProps> = ({
  ringConfig,
  screenState,
  onChangeRingConfig,
  onChangeScreenState
}) => {
  const effects: { id: AnimationEffect; label: string; icon: React.ReactNode }[] = [
    { id: 'rotating_sweep', label: 'دوران 360 طيفي', icon: <RotateCw className="w-3.5 h-3.5" /> },
    { id: 'breathing', label: 'تنفس ناعم (Pulse)', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'battery_ring', label: 'مؤشر البطارية', icon: <BatteryCharging className="w-3.5 h-3.5" /> },
    { id: 'radar_wave', label: 'موجات رادار', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'chroma_flow', label: 'طيف متعدد الألوان', icon: <Rainbow className="w-3.5 h-3.5" /> },
    { id: 'strobe_alert', label: 'وميض تنبيه سريع', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Screen State Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">حالة الشاشة في المحاكي:</span>
          <span className="text-[11px] text-slate-400">اختبر ظهور الطبقة العائمة فوق حالات النظام</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeScreenState('screen_on')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              screenState === 'screen_on'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>الشاشة مفتوحة (Apps)</span>
          </button>

          <button
            onClick={() => onChangeScreenState('aod_black')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              screenState === 'aod_black'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>شاشة أوليد مغلقة (AOD)</span>
          </button>

          <button
            onClick={() => onChangeScreenState('lock_screen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              screenState === 'lock_screen'
                ? 'bg-purple-900/80 text-purple-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>شاشة القفل</span>
          </button>
        </div>
      </div>

      {/* Animation Effects Buttons */}
      <div>
        <label className="text-xs font-bold text-white mb-2 block">
          نمط الحركة والمؤثر البصري (Ring Light Shader Effect):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {effects.map((eff) => (
            <button
              key={eff.id}
              onClick={() => onChangeRingConfig(prev => ({ ...prev, effect: eff.id }))}
              className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 ${
                ringConfig.effect === eff.id
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-cyan-400">{eff.icon}</div>
              <span className="text-[11px] leading-tight">{eff.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders for Thickness, Padding, Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Thickness */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>سماكة الحلقة (Stroke Width)</span>
            <span className="font-mono text-cyan-400">{ringConfig.thickness} px</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            value={ringConfig.thickness}
            onChange={(e) => onChangeRingConfig(prev => ({ ...prev, thickness: Number(e.target.value) }))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Offset Padding */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>البعد عن حافة العدسة (Offset Gap)</span>
            <span className="font-mono text-cyan-400">{ringConfig.offsetPadding} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            value={ringConfig.offsetPadding}
            onChange={(e) => onChangeRingConfig(prev => ({ ...prev, offsetPadding: Number(e.target.value) }))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Glow Blur */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>توهج النيون (Blur Radius)</span>
            <span className="font-mono text-cyan-400">{ringConfig.glowBlur} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={ringConfig.glowBlur}
            onChange={(e) => onChangeRingConfig(prev => ({ ...prev, glowBlur: Number(e.target.value) }))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
