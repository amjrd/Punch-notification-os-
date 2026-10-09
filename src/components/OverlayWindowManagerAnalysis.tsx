import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  MousePointer, 
  TouchpadOff,
  Copy,
  Check
} from 'lucide-react';

interface OverlayWindowManagerAnalysisProps {
  onCopySnippet: (text: string) => void;
}

export const OverlayWindowManagerAnalysis: React.FC<OverlayWindowManagerAnalysisProps> = ({
  onCopySnippet
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFlag, setActiveFlag] = useState<string>('FLAG_NOT_TOUCHABLE');

  const flagsAnalysis = [
    {
      name: 'TYPE_APPLICATION_OVERLAY',
      type: 'نوع النافذة (Window Type)',
      api: 'Android 8.0+ (API 26)',
      purpose: 'يحدد نوع الطبقة العائمة المسموح بها في الإصدارات الحديثة، ويستبدل الأنواع القديمة المعطلة (TYPE_SYSTEM_ALERT و TYPE_PHONE). يتطلب موافقة المستخدم في إعدادات النظام عبر Settings.ACTION_MANAGE_OVERLAY_PERMISSION.',
      critical: true
    },
    {
      name: 'FLAG_NOT_TOUCHABLE',
      type: 'علم التفاعل مع اللمس (Touch Passthrough)',
      api: 'All APIs',
      purpose: 'الجوهر التقني لعدم التأثير على استجابة الشاشة! يوجه نظام InputDispatcher لتجاهل هذه النافذة كهدف للمس، وتمرير كافة أحداث MotionEvent (اللمس، السحب، النقر المزدوج) مباشرة إلى التطبيق المفتوح بالخلفية دون أي تأخير.',
      critical: true
    },
    {
      name: 'FLAG_NOT_FOCUSABLE',
      type: 'علم تركيز لوحة المفاتيح (Input Focus)',
      api: 'All APIs',
      purpose: 'يمنع النافذة من سحب التركيز (Focus). هذا يضمن عدم إغلاق لوحة المفاتيح أثناء كتابة المستخدم في واتساب أو أي تطبيق آخر، وعدم اعتراض أزرار الصوت أو الرجوع.',
      critical: true
    },
    {
      name: 'FLAG_LAYOUT_NO_LIMITS',
      type: 'تجاوز حدود الشاشة (No Screen Limits)',
      api: 'All APIs',
      purpose: 'يسمح للنافذة بالتمدد خارج حدود العرض المعتادة وتجاوز منطقة شريط الحالة (Status Bar)، مما يتيح الرسم المباشر والدقيق فوق أعلى بيكسل في الشاشة عند منطقة ثقب الكاميرا.',
      critical: true
    },
    {
      name: 'FLAG_LAYOUT_IN_SCREEN',
      type: 'تموضع الشاشة (In-Screen Geometry)',
      api: 'All APIs',
      purpose: 'يضع إحداثيات النافذة بالنسبة للشاشة الكلية بدلاً من منطقة التطبيق المحصورة تحت شريط الإشعارات.',
      critical: false
    },
    {
      name: 'PixelFormat.TRANSLUCENT',
      type: 'هيئة البيكسلات (Pixel Alpha Format)',
      api: 'Android Graphics',
      purpose: 'يحدد نسق 32-bit ARGB_8888 مع قناة شفافية كاملة (Alpha Channel). يضمن أن البيكسلات خارج محيط حلقة الضوء شفافة تماماً ولا تسبب أي تعتيم أو وميض على شاشة المستخدم.',
      note: 'ملاحظة: في المسودة كُتبت TRANSLATION_MOIST، والصيغة الرسمية المعتمدة في Android SDK هي PixelFormat.TRANSLUCENT.',
      critical: true
    }
  ];

  const handleCopy = (code: string) => {
    onCopySnippet(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800/60">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                المكون 3: تحليل هندسة الطبقة العائمة (Overlay Window Manager)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                WindowManager.LayoutParams & Touch Passthrough Architecture
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/70 px-2.5 py-1 rounded-full border border-purple-800/80">
            Zero Touch Latency
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          يكمن التحدي الرئيسي لتطبيقات إضاءة الكاميرا في عرض حلقة مضيئة تغطي جزءاً من الشاشة دون جعل الشاشة عاجزة عن الاستجابة للّمس، ودون منع المستخدم من لمس أزرار التطبيقات الواقعة في شريط الأدوات العلوي.
          تحقق دالة <code className="text-cyan-300 font-mono">createHolePunchOverlay</code> ذلك بتكديس الأعلام الدقيقة:
        </p>
      </div>

      {/* Code Snippet Box with User Function Highlighted */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              الكود المعتمد لإنشاء النافذة العائمة (Kotlin Implementation)
            </h4>
          </div>
          <button
            onClick={() => handleCopy(`fun createHolePunchOverlay(context: Context, centerX: Float, centerY: Float, radius: Float): View {
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    val params = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        PixelFormat.TRANSLUCENT // خلفية شفافة بالكامل
    )

    val customCanvasView = HolePunchRingView(context, centerX, centerY, radius)
    windowManager.addView(customCanvasView, params)
    return customCanvasView
}`)}
            className="px-2.5 py-1 text-xs text-cyan-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>

        {/* Code Block with line numbering */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto text-slate-200 leading-relaxed dir-ltr text-left">
          <pre>{`fun createHolePunchOverlay(context: Context, centerX: Float, centerY: Float, radius: Float): View {
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    val params = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        PixelFormat.TRANSLUCENT // خلفية شفافة بالكامل (معالجة TRANSLATION_MOIST)
    )

    val customCanvasView = HolePunchRingView(context, centerX, centerY, radius)
    windowManager.addView(customCanvasView, params)
    return customCanvasView
}`}</pre>
        </div>
      </div>

      {/* Flag by Flag Breakdown Grid */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>تشريح وظيفة كل علم (Flags Architectural Breakdown)</span>
        </h4>

        <div className="space-y-3">
          {flagsAnalysis.map((flag) => {
            const isSelected = activeFlag === flag.name;
            return (
              <div
                key={flag.name}
                onClick={() => setActiveFlag(flag.name)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/80 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {flag.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {flag.api}
                    </span>
                  </div>
                  <span className="text-xs text-purple-400 font-medium">
                    {flag.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {flag.purpose}
                </p>

                {flag.note && (
                  <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{flag.note}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
