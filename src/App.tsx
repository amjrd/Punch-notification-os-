import React, { useState } from 'react';
import { 
  Bell, 
  Crop, 
  Layers, 
  Copy, 
  Check, 
  Smartphone, 
  Moon, 
  Sun,
  MousePointerClick,
  Sparkles
} from 'lucide-react';

interface AppNotification {
  name: string;
  pkg: string;
  color: string;
  title: string;
  message: string;
}

export default function App() {
  // Simple App Notifications list
  const apps: AppNotification[] = [
    { 
      name: 'WhatsApp', 
      pkg: 'com.whatsapp', 
      color: '#25D366', 
      title: 'أحمد علي', 
      message: 'رسالة جديدة في المجموعة' 
    },
    { 
      name: 'Telegram', 
      pkg: 'org.telegram.messenger', 
      color: '#2AABEE', 
      title: 'قناة أندرويد', 
      message: 'تم نشر مقال المعمارية الجديد' 
    },
    { 
      name: 'Gmail', 
      pkg: 'com.google.android.gm', 
      color: '#EA4335', 
      title: 'فريق Google', 
      message: 'تنبيه أمان جديد في حسابك' 
    },
    { 
      name: 'مكالمة فائتة', 
      pkg: 'com.android.phone', 
      color: '#F59E0B', 
      title: 'مكالمة فائتة', 
      message: 'رنّ منذ دقيقتين' 
    }
  ];

  // 1. Selected Notification State
  const [selectedApp, setSelectedApp] = useState<AppNotification>(apps[0]);

  // 2. Cutout Position State (center, left, right)
  const [cutoutPosition, setCutoutPosition] = useState<'center' | 'left' | 'right'>('center');

  // 3. Screen Mode (On or Black AOD)
  const [isAodMode, setIsAodMode] = useState<boolean>(false);

  // 4. Ring Effect (rotating vs pulse)
  const [effect, setEffect] = useState<'rotate' | 'pulse'>('rotate');

  // Touch test counter
  const [touchCount, setTouchCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Position coordinates on 320px phone screen width
  const getCutoutX = () => {
    if (cutoutPosition === 'left') return 45;
    if (cutoutPosition === 'right') return 275;
    return 160; // center
  };

  const cutoutX = getCutoutX();
  const cutoutY = 26;
  const radius = 13;

  const kotlinCode = `// دالة إنشاء الطبقة العائمة بدون حجب اللمس
fun createHolePunchOverlay(context: Context, centerX: Float, centerY: Float, radius: Float): View {
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    val params = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or      // يمرر اللمس للتطبيقات بالأسفل!
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        PixelFormat.TRANSLUCENT                                      // خلفية شفافة بالكامل
    )

    val customCanvasView = HolePunchRingView(context, centerX, centerY, radius)
    windowManager.addView(customCanvasView, params)
    return customCanvasView
}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(kotlinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header بسيط وأنيق */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            ◎
          </div>
          <div>
            <h1 className="text-base font-bold text-white">إضاءة ثقب الكاميرا (Hole Punch Light)</h1>
            <p className="text-xs text-slate-400">محاكاة معمارية أندرويد المبسطة</p>
          </div>
        </div>

        <button
          onClick={() => setIsAodMode(!isAodMode)}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {isAodMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isAodMode ? 'تشغيل الشاشة (Screen ON)' : 'وضع الشاشة السوداء (OLED AOD)'}</span>
        </button>
      </header>

      {/* Main Content Area: عمودين فقط (الهاتف + الشرح المبسط) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* العمود الأيمن: لوحة التحكم والشرح بالمكونات الثلاثة البسيطة                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
          
          {/* المكون 1: التقاط الإشعارات وفك اللون */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-800/50">
                1
              </span>
              <h2 className="text-sm font-bold text-white">التقاط الإشعارات وفك لون التطبيق</h2>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              تستمع <code className="text-cyan-400 font-mono">NotificationListenerService</code> للإشعار وتستخرج لون التطبيق تلقائياً (أخضر لواتساب، أزرق لتيليجرام). اختر تطبيقاً لتجربته:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {apps.map((app) => {
                const isSelected = selectedApp.name === app.name;
                return (
                  <button
                    key={app.name}
                    onClick={() => setSelectedApp(app)}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-white/20 shadow-md ring-1 ring-white/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: app.color }}
                      />
                      <span className="text-xs font-bold text-white truncate">{app.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{app.color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* المكون 2: موضع ثقب الكاميرا */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-800/50">
                2
              </span>
              <h2 className="text-sm font-bold text-white">تحديد موضع ثقب الكاميرا (Cutout Engine)</h2>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              تحسب واجهة <code className="text-cyan-400 font-mono">DisplayCutout</code> مركز ونصف قطر الكاميرا لرسم الحلقة حولها بدقة. اختر موضع الثقب:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'left', label: 'في اليسار (OnePlus)' },
                { id: 'center', label: 'في المنتصف (S24 / Pixel)' },
                { id: 'right', label: 'في اليمين (Galaxy S10)' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setCutoutPosition(pos.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    cutoutPosition === pos.id
                      ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* المكون 3: الطبقة العائمة بدون حجب اللمس */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-950 text-purple-400 text-xs font-bold flex items-center justify-center border border-purple-800/50">
                  3
                </span>
                <h2 className="text-sm font-bold text-white">الطبقة العائمة دون تعطيل اللمس</h2>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-medium text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              السر يكمن في راية <code className="text-purple-300 font-mono font-bold">FLAG_NOT_TOUCHABLE</code> التي تسمح بمرور كل النقرات للتطبيقات الواقعة خلفها دون أي حجب:
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto dir-ltr text-left">
              <pre>{kotlinCode}</pre>
            </div>
          </div>

          {/* تأثير الحركة السريع (دوران أو نبض) */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">نمط حركة حلقة الإضاءة:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEffect('rotate')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${effect === 'rotate' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                دوران مستمر (Sweep)
              </button>
              <button
                onClick={() => setEffect('pulse')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${effect === 'pulse' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                تنفس ناعم (Pulse)
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* العمود الأيسر: محاكي الهاتف الحي المبسط                                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2 sticky top-20">
          
          <div className="relative w-[310px] sm:w-[330px] h-[640px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-700/80 select-none">
            
            {/* الشاشة الداخلية */}
            <div className={`relative w-full h-full rounded-[36px] overflow-hidden transition-colors duration-300 ${isAodMode ? 'bg-black' : 'bg-slate-950'}`}>
              
              {/* محتوى الشاشة (الطبقة السفلية) */}
              {isAodMode ? (
                // شاشة سوداء OLED AOD
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl font-mono font-light text-slate-300 mt-16">
                    10:45
                  </div>
                  <div className="text-xs text-slate-500 mt-2 font-medium">
                    الجمعة، 9 أكتوبر
                  </div>
                  <div className="text-[11px] text-emerald-500/80 font-mono mt-1">
                    99% بكسلات مطفأة (0 واط)
                  </div>

                  {/* إشعار مبسط */}
                  <div className="mt-12 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 max-w-[200px]">
                    <div 
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedApp.color }}
                    />
                    <div className="text-right truncate text-xs text-slate-300">
                      <div className="font-bold">{selectedApp.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{selectedApp.title}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // شاشة التطبيقات المفتوحة
                <div className="w-full h-full flex flex-col justify-between pt-12 pb-6 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
                  
                  {/* كارت الإشعار النشط */}
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl shadow-lg flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: selectedApp.color }}
                    >
                      {selectedApp.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                        <span className="font-bold text-white">{selectedApp.name}</span>
                        <span>الآن</span>
                      </div>
                      <div className="text-xs text-slate-200 truncate">{selectedApp.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{selectedApp.message}</div>
                    </div>
                  </div>

                  {/* منطقة تجربة عدم حجب اللمس */}
                  <div className="p-3.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-center space-y-2">
                    <div className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span>تجربة النقر تحت الحلقة العائمة</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      انقر للتأكد من أن النافذة العائمة لا تعترض اللمس:
                    </p>
                    <button
                      onClick={() => setTouchCount(prev => prev + 1)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-all"
                    >
                      انقر هنا لاختبار اللمس ({touchCount})
                    </button>
                    {touchCount > 0 && (
                      <div className="text-[10px] text-emerald-400 font-mono">
                        ✓ استجابت الشاشة بنجاح! اللمس لم يُحجب
                      </div>
                    )}
                  </div>

                  {/* شريط الأيقونات السفلية */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                    <div className="p-2 bg-slate-800/40 rounded-xl">المحادثات</div>
                    <div className="p-2 bg-slate-800/40 rounded-xl">الحالة</div>
                    <div className="p-2 bg-slate-800/40 rounded-xl">المكالمات</div>
                  </div>

                </div>
              )}

              {/* شريط الحالة بالأعلى */}
              <div className="absolute top-0 inset-x-0 h-8 px-5 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
                <span>10:45</span>
                <span>85% 🔋</span>
              </div>

              {/* ============================================================= */}
              {/* الطبقة العائمة (SVG Overlay Ring) المحيطة بثقب الكاميرا        */}
              {/* ============================================================= */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={selectedApp.color} stopOpacity="1" />
                      <stop offset="70%" stopColor={selectedApp.color} stopOpacity="0.8" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* هالة التوهج الخارجية */}
                  <circle
                    cx={cutoutX}
                    cy={cutoutY}
                    r={radius + 3}
                    fill="none"
                    stroke={selectedApp.color}
                    strokeWidth="4"
                    strokeOpacity="0.4"
                    className={effect === 'pulse' ? 'animate-pulse' : ''}
                  />

                  {/* حلقة الإضاءة الرئيسية */}
                  {effect === 'rotate' ? (
                    <g
                      className="animate-spin"
                      style={{
                        transformOrigin: `${cutoutX}px ${cutoutY}px`,
                        animationDuration: '1.8s'
                      }}
                    >
                      <circle
                        cx={cutoutX}
                        cy={cutoutY}
                        r={radius + 3}
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={`${radius * 3.5} ${radius * 1.5}`}
                      />
                    </g>
                  ) : (
                    <circle
                      cx={cutoutX}
                      cy={cutoutY}
                      r={radius + 3}
                      fill="none"
                      stroke={selectedApp.color}
                      strokeWidth="3.5"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* ثقب الكاميرا الفعلي (عدسة سوداء) */}
                <div
                  className="absolute pointer-events-none transition-all duration-300"
                  style={{
                    left: `${cutoutX}px`,
                    top: `${cutoutY}px`,
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-950/60 m-auto mt-1" />
                </div>
              </div>

            </div>

          </div>

          <div className="mt-3 text-[11px] text-slate-500 text-center font-mono">
            {cutoutPosition === 'center' ? 'ثقب في المنتصف' : cutoutPosition === 'left' ? 'ثقب في اليسار' : 'ثقب في اليمين'} · لون الإضاءة: {selectedApp.color}
          </div>

        </div>

      </main>

    </div>
  );
}
