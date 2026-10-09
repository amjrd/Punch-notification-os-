import React, { useState } from 'react';
import { CutoutGeometry, RingStyleConfig } from '../types';
import { 
  Zap, 
  Battery, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface BatteryOledProfilerProps {
  geometry: CutoutGeometry;
  ringConfig: RingStyleConfig;
  onUpdateRingConfig: (updater: (prev: RingStyleConfig) => RingStyleConfig) => void;
}

export const BatteryOledProfiler: React.FC<BatteryOledProfilerProps> = ({
  geometry,
  ringConfig,
  onUpdateRingConfig
}) => {
  const [refreshRate, setRefreshRate] = useState<60 | 30 | 15 | 1>(60);
  const [pixelShiftEnabled, setPixelShiftEnabled] = useState(true);

  // Mathematical Area Calculations
  const rOuter = geometry.radius + ringConfig.offsetPadding + ringConfig.thickness;
  const rInner = geometry.radius + ringConfig.offsetPadding;
  const illuminatedAreaPixels = Math.round(Math.PI * (rOuter * rOuter - rInner * rInner));
  
  // Typical FHD+ 1080 x 2400 screen pixels = 2,592,000 pixels
  const totalScreenPixels = 2592000;
  const pixelPercentage = ((illuminatedAreaPixels / totalScreenPixels) * 100).toFixed(4);

  // Battery Drain estimations per hour based on refresh rate
  const batteryDrainPerHour = 
    refreshRate === 60 ? 2.4 :
    refreshRate === 30 ? 1.4 :
    refreshRate === 15 ? 0.7 : 0.18;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                حاسبة كفاءة الطاقة لشاشات أوليد (AMOLED Battery Profiler)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Sub-Pixel Math & CPU WakeLock Power Consumption Analysis
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-800/80">
            0-Watt Black Pixels
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          تعتمد فكرة إضاءة ثقب الكاميرا على خاصية فيزيائية حصرية لشاشات <strong className="text-amber-300">OLED / AMOLED</strong>:
          الدايودات الباعثة للضوء تنطفئ ذاتياً تماماً عند اللون الأسود الصافي <code className="text-cyan-300 font-mono">#000000</code> وتستهلك <strong>صفر واط</strong>.
          لذا فإن إضاءة حلقة الثقب فقط على شاشة مغلقة تمثل بديلاً فائق التوفير لضوء الـ LED المفقود في الهواتف الحديثة.
        </p>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">البيكسلات المضاءة الفعالة:</div>
            <div className="text-xl font-bold text-cyan-400">
              {illuminatedAreaPixels.toLocaleString()} <span className="text-xs font-normal text-slate-400">بكسل</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              من إجمالي 2,592,000 بكسل للشاشة
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">نسبة المساحة من الشاشة:</div>
            <div className="text-xl font-bold text-emerald-400">
              {pixelPercentage}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              99.98% من الشاشة مطفأة تماماً (0 mA)
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">استهلاك البطارية المقدر:</div>
            <div className="text-xl font-bold text-amber-400">
              ~{batteryDrainPerHour}% <span className="text-xs font-normal text-slate-400">/ ساعة</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              بمعدل تحديث {refreshRate} FPS
            </div>
          </div>
        </div>
      </div>

      {/* Frame Rate Throttling Simulator */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>موازنة معدل الإطارات (FPS Throttling on AOD)</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          أثناء إيقاف الشاشة (AOD Mode)، يؤدي تشغيل الرسم بمعدل 60FPS إلى استهلاك المعالج (CPU WakeLock). يُنصح برمجياً بخفض التحديث إلى 15FPS أو وضع الوميض الثابت 1FPS:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { fps: 60, label: '60 FPS (فائق السلاسة)', drain: '~2.4%/ساعة', desc: 'مناسب عند تشغيل الشاشة' },
            { fps: 30, label: '30 FPS (متوازن)', drain: '~1.4%/ساعة', desc: 'توازن جيد بين السلاسة والطاقة' },
            { fps: 15, label: '15 FPS (تنفس اقتصادي)', drain: '~0.7%/ساعة', desc: 'الخيار الموصى به لشاشة AOD' },
            { fps: 1, label: '1 FPS (وميض ثابت)', drain: '~0.18%/ساعة', desc: 'أقصى توفير للطاقة' }
          ].map((item) => (
            <button
              key={item.fps}
              onClick={() => setRefreshRate(item.fps as 60 | 30 | 15 | 1)}
              className={`p-3 rounded-xl border text-right transition-all ${
                refreshRate === item.fps
                  ? 'bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500/40 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="font-mono font-bold text-xs text-cyan-300 mb-1">{item.label}</div>
              <div className="text-[11px] font-mono text-amber-400">{item.drain}</div>
              <div className="text-[10px] text-slate-500 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Burn-in Protection Engineering Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">
              تقنية حماية الشاشة من الاحتراق (OLED Burn-in Pixel Shifting)
            </h4>
          </div>
          <button
            onClick={() => setPixelShiftEnabled(!pixelShiftEnabled)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              pixelShiftEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            {pixelShiftEnabled ? 'مفعلة (Pixel Shift ON)' : 'معطلة'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          بقاء البيكسلات المحيطة بالعدسة مضاءة بنفس المكان لساعات متواصلة قد يُجهد مركبات الفسفور العضوية (OLED Degradation).
          يقوم المحرك البرمجي بإزاحة إحداثيات مركز الثقب <code className="text-cyan-300 font-mono">(cx, cy)</code> بمقدار <strong className="text-white font-mono">1px إلى 2px</strong> عشوائياً كل 60 ثانية، وهي حركة غير ملحوظة للعين البشرية لكنها تضمن توزيع الجهد وتمنع الاحتراق تماماً.
        </p>

        <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 dir-ltr text-left">
          <pre>{`// كود خوارزمية الإزاحة الدورية (Anti Burn-in Engine)
fun applyPixelShifting() {
    val jitterX = (-1..1).random()
    val jitterY = (-1..1).random()
    currentCenterX = baseCenterX + jitterX
    currentCenterY = baseCenterY + jitterY
    ringView.updatePosition(currentCenterX, currentCenterY)
}`}</pre>
        </div>
      </div>
    </div>
  );
};
