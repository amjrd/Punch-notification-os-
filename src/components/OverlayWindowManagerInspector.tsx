import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Eye, 
  Sliders, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { RingStyleConfig, AnimationEffect } from '../types';

interface OverlayWindowManagerInspectorProps {
  ringConfig: RingStyleConfig;
  onChange: (config: RingStyleConfig) => void;
}

export const OverlayWindowManagerInspector: React.FC<OverlayWindowManagerInspectorProps> = ({
  ringConfig,
  onChange,
}) => {
  const ANIMATION_EFFECTS: { id: AnimationEffect; nameAr: string; nameEn: string; desc: string }[] = [
    {
      id: 'rotating_sweep',
      nameAr: 'حلقة دوارة (Rotating Sweep)',
      nameEn: 'SweepGradient 360°',
      desc: 'دوران تدرج لوني دائري مستمر حول محيط ثقب الكاميرا'
    },
    {
      id: 'breathing',
      nameAr: 'تأثير التنفس الناعم (Breathing Pulse)',
      nameEn: 'Smooth Alpha Pulse',
      desc: 'نبض انسيابي يتلاشى تدريجياً لتقليل استهلاك الطاقة'
    },
    {
      id: 'battery_ring',
      nameAr: 'مؤشر نسبة شحن البطارية (Battery Arc)',
      nameEn: 'Battery Level Indicator',
      desc: 'قوس لوني محيطي يتناسب مع النسبة المئوية لشحن الهاتف'
    },
    {
      id: 'radar_wave',
      nameAr: 'موجات الرادار (Radar Ripple)',
      nameEn: 'Concentric Sonic Waves',
      desc: 'حلقات إشعاعية متسعة تنطلق للخارج عند التنبيه'
    },
    {
      id: 'chroma_flow',
      nameAr: 'تدفق ألوان الطيف (Chroma Flow)',
      nameEn: 'RGB Rainbow Spectrum',
      desc: 'تدرج طيفي متعدد الألوان يدور بسلاسة'
    },
    {
      id: 'strobe_alert',
      nameAr: 'وميض الطوارئ السريع (Strobe Flash)',
      nameEn: 'Urgent Strobe Flash',
      desc: 'وميض تنبيهي عالي السرعة للإشعارات الحرجة والمكالمات'
    }
  ];

  const FLAGS_EXPLANATION = [
    {
      flag: 'FLAG_NOT_FOCUSABLE',
      role: 'منع سرقة التركيز',
      desc: 'يمنع النافذة من سرقة التركيز من التطبيقات المفتوحة، مما يسمح للوحة المفاتيح بالعمل بشكل طبيعي.',
      required: true
    },
    {
      flag: 'FLAG_NOT_TOUCHABLE',
      role: 'عبور كامل للمسات (Zero Touch Interception)',
      desc: 'يجعل النافذة شفافة بنسبة 100% لجميع أحداث اللمس (MotionEvent)، بحيث تمر كافة النقرات للشاشة خلفها دون أي تأخير.',
      required: true
    },
    {
      flag: 'FLAG_LAYOUT_IN_SCREEN & NO_LIMITS',
      role: 'تجاوز حدود شريط الحالة (StatusBar Bypass)',
      desc: 'يسمح لسطح الرسم بالامتداد إلى الحواف المطلقة للشاشة متجاوزاً شريط الحالة ليرسم داخل منطقة النتوء وثقب الكاميرا.',
      required: true
    },
    {
      flag: 'PixelFormat.TRANSLUCENT',
      role: 'شفافية عتادية 32-bit ARGB',
      desc: 'يضمن أن خلفية النافذة العائمة شفافة تماماً، وفقط البكسلات المرسومة في الحلقة هي التي تضيء.',
      required: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Non-Blocking Touch Overlay Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span>معمارية عدم حجب اللمس (Non-Blocking Overlay Architecture)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          لإنشاء طبقة عائمة تغطي الشاشة بالكامل دون التأثير على استجابة الشاشة للمس، يجب استخدام النافذة من نوع <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">TYPE_APPLICATION_OVERLAY</code> مع تركيب دقيق لرايات <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">WindowManager.LayoutParams</code>:
        </p>

        {/* Essential Flags Breakdown */}
        <div className="space-y-2.5">
          {FLAGS_EXPLANATION.map((item, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-300">{item.flag}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">{item.role}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ring Animation Effects Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          أنماط وتأثيرات حركة الإضاءة (Light Effects & Animations)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ANIMATION_EFFECTS.map((eff) => {
            const isSelected = ringConfig.effect === eff.id;
            return (
              <button
                key={eff.id}
                type="button"
                onClick={() => onChange({ ...ringConfig, effect: eff.id })}
                className={`text-right p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{eff.nameAr}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{eff.nameEn}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{eff.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ring Visual Parameters (Thickness, Gap, Speed, Glow) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          تخصيص أبعاد ومظهر حلقة الإضاءة (Visual Canvas Tuning)
        </h3>

        <div className="space-y-4">
          {/* Thickness Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">سماكة خط الحلقة (Stroke Width):</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{ringConfig.thickness} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={ringConfig.thickness}
              onChange={(e) => onChange({ ...ringConfig, thickness: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Offset Padding (Distance from Cutout edge) */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">المسافة الفاصلة عن حافة الثقب (Offset Margin):</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{ringConfig.offsetPadding} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={ringConfig.offsetPadding}
              onChange={(e) => onChange({ ...ringConfig, offsetPadding: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Speed */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">سرعة دورة الحركة (Cycle Duration):</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{ringConfig.speed} ثانية</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="4.0"
              step="0.2"
              value={ringConfig.speed}
              onChange={(e) => onChange({ ...ringConfig, speed: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Battery Percent (if battery ring selected) */}
          {ringConfig.effect === 'battery_ring' && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">نسبة شحن البطارية الافتراضية:</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">{ringConfig.batteryPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={ringConfig.batteryPercent}
                onChange={(e) => onChange({ ...ringConfig, batteryPercent: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          )}

          {/* Glow and Blur controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="glowToggle"
                checked={ringConfig.glowEnabled}
                onChange={(e) => onChange({ ...ringConfig, glowEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
              />
              <label htmlFor="glowToggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                تفعيل وهج النيون الخارجي (Glow Bloom Effect)
              </label>
            </div>

            {ringConfig.glowEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">شدة الوهج:</span>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={ringConfig.glowBlur}
                  onChange={(e) => onChange({ ...ringConfig, glowBlur: Number(e.target.value) })}
                  className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
