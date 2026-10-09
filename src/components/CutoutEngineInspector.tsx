import React from 'react';
import { CutoutGeometry, CutoutPosition } from '../types';
import { CUTOUT_PRESETS } from '../data/architectureData';
import { 
  Crop, 
  Crosshair, 
  Compass, 
  Sliders, 
  Eye, 
  EyeOff, 
  Smartphone,
  Cpu,
  Calculator
} from 'lucide-react';

interface CutoutEngineInspectorProps {
  geometry: CutoutGeometry;
  onGeometryChange: (geo: CutoutGeometry) => void;
  showBoundingBox: boolean;
  onToggleBoundingBox: () => void;
}

export const CutoutEngineInspector: React.FC<CutoutEngineInspectorProps> = ({
  geometry,
  onGeometryChange,
  showBoundingBox,
  onToggleBoundingBox
}) => {
  const handlePresetSelect = (presetKey: string) => {
    const preset = CUTOUT_PRESETS[presetKey];
    if (preset) {
      onGeometryChange({ ...preset });
    }
  };

  const updateNumeric = (key: keyof CutoutGeometry, val: number) => {
    onGeometryChange({
      ...geometry,
      position: 'custom',
      [key]: val
    });
  };

  // Mathematical outputs
  const calculatedLeft = geometry.centerX - geometry.radius;
  const calculatedRight = geometry.centerX + geometry.radius;
  const calculatedTop = geometry.centerY - geometry.radius;
  const calculatedBottom = geometry.centerY + geometry.radius;
  const diameter = geometry.radius * 2;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/60">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                المكون 2: محرك كشف ثقب الكاميرا (Cutout Engine)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Android 9+ (API 28) DisplayCutout & Rect Mathematics
              </p>
            </div>
          </div>

          <button
            onClick={onToggleBoundingBox}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showBoundingBox
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/80 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {showBoundingBox ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showBoundingBox ? 'إخفاء محاور الإحداثيات' : 'إظهار محاور الإحداثيات (Debug)'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          يوفر نظام Android كائن <code className="text-cyan-300 font-mono">WindowInsets.displayCutout</code> الذي يحتوي على مصفوفة المستطيلات المحيطة بثقوب الكاميرا (<code className="text-cyan-300 font-mono">boundingRects</code>).
          يقوم المحرك باستخلاص أبعاد المستطيل وحساب المركز <code className="text-cyan-300 font-mono">(cx, cy)</code> ونصف القطر <code className="text-cyan-300 font-mono">R</code> بدقة الميكروبكسل.
        </p>

        {/* Live Mathematical Formulas Box */}
        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>المعادلات الهندسية لحساب المركز والقطر:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 text-[11px]">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">المركز الأفقي (Center X):</span>
              <span className="text-cyan-300 font-bold">cx = (left + right) / 2</span>
              <div className="text-slate-400 mt-1">
                = ({Math.round(calculatedLeft)} + {Math.round(calculatedRight)}) / 2 = <strong className="text-white">{Math.round(geometry.centerX)}px</strong>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">المركز الرأسي (Center Y):</span>
              <span className="text-cyan-300 font-bold">cy = (top + bottom) / 2</span>
              <div className="text-slate-400 mt-1">
                = ({Math.round(calculatedTop)} + {Math.round(calculatedBottom)}) / 2 = <strong className="text-white">{Math.round(geometry.centerY)}px</strong>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">نصف القطر (Radius R):</span>
              <span className="text-cyan-300 font-bold">R = (max(W, H) / 2) + pad</span>
              <div className="text-slate-400 mt-1">
                = ({diameter} / 2) = <strong className="text-white">{geometry.radius}px</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Smartphone Cutouts */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>أنماط ومواقع ثقب الكاميرا في الأجهزة الشهيرة</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'center', label: 'ثقب في المنتصف', desc: 'Galaxy S24 / Pixel 9', icon: '⊙' },
            { id: 'left', label: 'ثقب في اليسار', desc: 'OnePlus / Realme', icon: '◖' },
            { id: 'right', label: 'ثقب في اليمين', desc: 'Galaxy S10 series', icon: '◗' },
            { id: 'pill', label: 'كبسولة مزدوجة', desc: 'Dynamic / Huawei', icon: '⬬' },
            { id: 'notch', label: 'نوتش قطرة ماء', desc: 'Waterdrop Notch', icon: '⌄' },
          ].map((item) => {
            const isSelected = geometry.position === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePresetSelect(item.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="text-lg font-mono mb-1">{item.icon}</div>
                <div className="text-xs font-bold text-white mb-0.5">{item.label}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Calibration Sliders */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>معايرة الإحداثيات اليدوية (Pixel Calibration Sliders)</span>
          </h4>
          <span className="text-[11px] text-cyan-400 font-mono">
            X:{Math.round(geometry.centerX)}px | Y:{Math.round(geometry.centerY)}px | R:{geometry.radius}px
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slider X */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>الإزاحة الأفقية (Center X)</span>
              <span className="font-mono text-cyan-400">{Math.round(geometry.centerX)} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="360"
              value={geometry.centerX}
              onChange={(e) => updateNumeric('centerX', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Slider Y */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>الإزاحة الرأسية (Center Y)</span>
              <span className="font-mono text-cyan-400">{Math.round(geometry.centerY)} px</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={geometry.centerY}
              onChange={(e) => updateNumeric('centerY', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Slider Radius */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>نصف قطر ثقب الكاميرا (Radius)</span>
              <span className="font-mono text-cyan-400">{geometry.radius} px</span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              value={geometry.radius}
              onChange={(e) => updateNumeric('radius', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {geometry.position === 'pill' && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>عرض الكبسولة (Pill Width)</span>
                <span className="font-mono text-cyan-400">{geometry.width || 64} px</span>
              </div>
              <input
                type="range"
                min="36"
                max="120"
                value={geometry.width || 64}
                onChange={(e) => updateNumeric('width', Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>ارتفاع الكبسولة (Pill Height)</span>
                <span className="font-mono text-cyan-400">{geometry.height || 24} px</span>
              </div>
              <input
                type="range"
                min="16"
                max="40"
                value={geometry.height || 24}
                onChange={(e) => updateNumeric('height', Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
