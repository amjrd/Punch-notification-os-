import React, { useState } from 'react';
import { 
  CutoutGeometry, 
  RingStyleConfig, 
  ScreenState, 
  AppNotification 
} from '../types';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Send, 
  CheckCheck, 
  PhoneCall, 
  Sparkles,
  MousePointerClick,
  Layers,
  RotateCw
} from 'lucide-react';

interface PhoneSimulatorProps {
  geometry: CutoutGeometry;
  ringConfig: RingStyleConfig;
  screenState: ScreenState;
  activeNotification: AppNotification | null;
  showBoundingBox: boolean;
  onGeometryChange?: (newGeo: CutoutGeometry) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  geometry,
  ringConfig,
  screenState,
  activeNotification,
  showBoundingBox,
  onGeometryChange
}) => {
  const [touchLog, setTouchLog] = useState<string>('جاهز لاختبار تمرير اللمس عبر الطبقة');
  const [clickCount, setClickCount] = useState<number>(0);
  const [simulatedApp, setSimulatedApp] = useState<'chat' | 'home' | 'game'>('chat');

  const handleTestClick = (name: string) => {
    setClickCount(prev => prev + 1);
    setTouchLog(`⚡ تم تمرير اللمس بنجاح إلى: [${name}] | النقرة رقم ${clickCount + 1}`);
  };

  // Ring styling calculations
  const color = activeNotification ? activeNotification.appColor : ringConfig.activeColor;
  const secondary = activeNotification?.secondaryColor || ringConfig.secondaryColor;
  const ringRadius = geometry.radius + ringConfig.offsetPadding;

  // Bounding box dimensions for visual overlay
  const boundWidth = geometry.position === 'pill' ? (geometry.width || 64) : geometry.radius * 2;
  const boundHeight = geometry.position === 'pill' ? (geometry.height || 24) : geometry.radius * 2;
  const boundLeft = geometry.centerX - (geometry.position === 'pill' ? (geometry.width || 64) / 2 : geometry.radius);
  const boundTop = geometry.centerY - geometry.radius;

  // Calculate battery arc if in battery mode
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (ringConfig.batteryPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Phone Hardware Chassis */}
      <div className="relative w-[340px] sm:w-[380px] h-[720px] bg-slate-900 rounded-[50px] p-[10px] shadow-2xl shadow-cyan-950/40 ring-1 ring-slate-800 border-4 border-slate-700/80 select-none">
        
        {/* Hardware side buttons */}
        <div className="absolute -left-[7px] top-[140px] w-[3px] h-[48px] bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-[200px] w-[3px] h-[48px] bg-slate-700 rounded-l" />
        <div className="absolute -right-[7px] top-[160px] w-[3px] h-[64px] bg-slate-700 rounded-r" />

        {/* Outer screen glass container */}
        <div className={`relative w-full h-full rounded-[42px] overflow-hidden transition-colors duration-500 ${
          screenState === 'aod_black' ? 'bg-black' : 'bg-slate-950'
        }`}>

          {/* ========================================================================= */}
          {/* 1. LAYER: PHONE SCREEN CONTENT (UNDERLAY APPS / OS UI)                   */}
          {/* ========================================================================= */}
          
          {screenState === 'aod_black' ? (
            /* AMOLED True-Black Always-on-Display (AOD) Mode */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-auto">
              <div className="text-center mt-20">
                <div className="text-6xl font-light tracking-tight font-mono text-slate-200">
                  10:45
                </div>
                <div className="text-sm font-medium text-slate-500 mt-2">
                  الجمعة، 9 أكتوبر · الرياض
                </div>
                <div className="text-xs text-emerald-500/80 font-mono mt-1">
                  85% شحن مستقر
                </div>
              </div>

              {activeNotification && (
                <div className="mt-12 flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 max-w-[240px] text-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                    style={{ backgroundColor: activeNotification.appColor }}
                  >
                    🔔
                  </div>
                  <span className="text-xs text-white font-medium">{activeNotification.appName}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{activeNotification.title}</span>
                </div>
              )}

              <div className="mt-auto mb-10 text-center px-4">
                <div className="text-[11px] text-slate-500 bg-slate-900/60 py-1.5 px-3 rounded-full border border-slate-800">
                  ⚡ وضع شاشة أوليد السوداء (0 واط للبكسلات المطفأة)
                </div>
              </div>
            </div>
          ) : screenState === 'lock_screen' ? (
            /* Lock Screen Mode */
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 flex flex-col p-6 pointer-events-auto">
              <div className="mt-16 text-center">
                <div className="text-5xl font-light text-white font-mono">10:45</div>
                <div className="text-sm text-indigo-200/80 mt-1">الجمعة، 9 أكتوبر</div>
              </div>

              {/* Notification card on lockscreen */}
              {activeNotification && (
                <div 
                  className="mt-10 p-3.5 bg-slate-900/90 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md"
                  style={{ borderRightColor: activeNotification.appColor, borderRightWidth: '4px' }}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-white">{activeNotification.appName}</span>
                    <span>{activeNotification.timestamp}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200">{activeNotification.title}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{activeNotification.message}</div>
                </div>
              )}

              <div className="mt-auto mb-4 text-center">
                <button 
                  onClick={() => handleTestClick('قفل الشاشة')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white rounded-xl transition-all border border-white/10"
                >
                  انقر هنا لاختبار تفاعل اللمس على شاشة القفل
                </button>
              </div>
            </div>
          ) : (
            /* Active App Mode (Screen On) */
            <div className="absolute inset-0 flex flex-col bg-slate-900">
              {/* App switcher bar inside phone */}
              <div className="pt-12 px-4 pb-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  {simulatedApp === 'chat' ? '💬 تطبيق المحادثة' : simulatedApp === 'home' ? '📱 الشاشة الرئيسية' : '🎮 تطبيق الألعاب'}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setSimulatedApp('chat')} 
                    className={`px-2 py-0.5 text-[10px] rounded transition-colors ${simulatedApp === 'chat' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    محادثة
                  </button>
                  <button 
                    onClick={() => setSimulatedApp('home')} 
                    className={`px-2 py-0.5 text-[10px] rounded transition-colors ${simulatedApp === 'home' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    رئيسية
                  </button>
                </div>
              </div>

              {/* Main App Canvas */}
              {simulatedApp === 'chat' ? (
                <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 max-w-[85%] bg-slate-800/90 p-3 rounded-2xl rounded-tr-none text-xs text-slate-200 border border-slate-700/50">
                      <div>
                        <div className="font-semibold text-cyan-400 text-[11px] mb-0.5">مطور النواة</div>
                        هل لاحظت كيف تستمر الشاشة بالاستجابة للّمس حتى أثناء دوران الحلقة المضيئة؟
                      </div>
                    </div>

                    <div className="flex items-start gap-2 max-w-[85%] mr-auto bg-cyan-950/80 p-3 rounded-2xl rounded-tl-none text-xs text-cyan-100 border border-cyan-800/50">
                      <div>
                        نعم! بفضل علم `FLAG_NOT_TOUCHABLE` يمر كل حدث MotionEvent فوراً لتطبيقنا!
                      </div>
                    </div>
                  </div>

                  {/* Interactive touch targets in app under overlay */}
                  <div className="mt-4 p-3 bg-slate-800/70 rounded-2xl border border-slate-700/60 space-y-2">
                    <div className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      اختبار اللمس الحي (أسفل الطبقة العائمة):
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTestClick('زر إرسال الرسالة')}
                        className="py-2 px-3 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        إرسال رسالة
                      </button>
                      <button
                        onClick={() => handleTestClick('زر إجراء مكالمة')}
                        className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        اتصال صوتي
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-6 grid grid-cols-3 gap-4 content-start">
                  {['المتصفح', 'الكاميرا', 'المعرض', 'الموسيقى', 'الملفات', 'الإعدادات'].map((app, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTestClick(`أيقونة ${app}`)}
                      className="flex flex-col items-center gap-1.5 p-2 bg-slate-800/50 hover:bg-slate-700/50 active:scale-90 rounded-2xl border border-slate-700/40 transition-all text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {app.slice(0, 1)}
                      </div>
                      <span className="text-[10px] text-slate-300">{app}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top Status Bar (Battery, WiFi, Time) */}
          <div className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-[11px] font-mono text-slate-300 z-10 pointer-events-none">
            <span className="font-semibold text-slate-200">10:45</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">85%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. LAYER: OVERLAY WINDOW MANAGER VIEW (HARDWARE TRANSLUCENT OVERLAY)      */}
          {/* Pointer events NONE so it perfectly mirrors FLAG_NOT_TOUCHABLE in Android */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none z-20">
            
            {/* SVG Canvas for High-Performance Glow and Ring Shaders */}
            <svg className="w-full h-full overflow-visible">
              <defs>
                {/* Glow Filter using GaussianBlur (similar to BlurMaskFilter in Android) */}
                <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={ringConfig.glowBlur} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Rotating Sweep Gradient Shader simulation */}
                <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="50%" stopColor={secondary} stopOpacity="0.8" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>

                {/* Chroma Rainbow Gradient */}
                <linearGradient id="chroma-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff0077" />
                  <stop offset="33%" stopColor="#00ffff" />
                  <stop offset="66%" stopColor="#00ff66" />
                  <stop offset="100%" stopColor="#ffaa00" />
                </linearGradient>
              </defs>

              {/* RENDER THE RING EFFECT AROUND CUTOUT */}
              {geometry.position === 'pill' ? (
                /* Pill / Dynamic cutout shape */
                <g>
                  {/* Outer glow ring */}
                  {ringConfig.glowEnabled && (
                    <rect
                      x={geometry.centerX - (geometry.width || 64) / 2 - ringConfig.offsetPadding}
                      y={geometry.centerY - (geometry.height || 24) / 2 - ringConfig.offsetPadding}
                      width={(geometry.width || 64) + ringConfig.offsetPadding * 2}
                      height={(geometry.height || 24) + ringConfig.offsetPadding * 2}
                      rx={geometry.radius + ringConfig.offsetPadding}
                      ry={geometry.radius + ringConfig.offsetPadding}
                      fill="none"
                      stroke={color}
                      strokeWidth={ringConfig.thickness + 4}
                      strokeOpacity="0.5"
                      filter="url(#ring-glow)"
                      className={ringConfig.effect === 'breathing' ? 'animate-pulse' : ''}
                    />
                  )}
                  {/* Sharp inner ring */}
                  <rect
                    x={geometry.centerX - (geometry.width || 64) / 2 - ringConfig.offsetPadding}
                    y={geometry.centerY - (geometry.height || 24) / 2 - ringConfig.offsetPadding}
                    width={(geometry.width || 64) + ringConfig.offsetPadding * 2}
                    height={(geometry.height || 24) + ringConfig.offsetPadding * 2}
                    rx={geometry.radius + ringConfig.offsetPadding}
                    ry={geometry.radius + ringConfig.offsetPadding}
                    fill="none"
                    stroke={ringConfig.effect === 'chroma_flow' ? 'url(#chroma-grad)' : color}
                    strokeWidth={ringConfig.thickness}
                    strokeDasharray={ringConfig.effect === 'strobe_alert' ? '8 4' : undefined}
                    className={`
                      ${ringConfig.effect === 'breathing' ? 'animate-pulse' : ''}
                      ${ringConfig.effect === 'strobe_alert' ? 'animate-bounce' : ''}
                    `}
                  />
                </g>
              ) : geometry.position === 'notch' ? (
                /* Waterdrop Notch cutout */
                <g>
                  <path
                    d={`M ${geometry.centerX - 24} 0 Q ${geometry.centerX - 16} ${geometry.notchDepth || 28} ${geometry.centerX} ${geometry.notchDepth || 28} Q ${geometry.centerX + 16} ${geometry.notchDepth || 28} ${geometry.centerX + 24} 0`}
                    fill="none"
                    stroke={color}
                    strokeWidth={ringConfig.thickness}
                    filter={ringConfig.glowEnabled ? 'url(#ring-glow)' : undefined}
                    className={ringConfig.effect === 'breathing' ? 'animate-pulse' : ''}
                  />
                </g>
              ) : (
                /* Circular Hole Punch (Center / Left / Right / Custom) */
                <g>
                  {/* Radar Ripple Waves if effect is radar_wave */}
                  {ringConfig.effect === 'radar_wave' && (
                    <>
                      <circle
                        cx={geometry.centerX}
                        cy={geometry.centerY}
                        r={ringRadius + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        className="animate-ping origin-center"
                        style={{ transformOrigin: `${geometry.centerX}px ${geometry.centerY}px` }}
                      />
                      <circle
                        cx={geometry.centerX}
                        cy={geometry.centerY}
                        r={ringRadius + 14}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        strokeOpacity="0.2"
                        className="animate-pulse origin-center"
                        style={{ transformOrigin: `${geometry.centerX}px ${geometry.centerY}px` }}
                      />
                    </>
                  )}

                  {/* Glow layer */}
                  {ringConfig.glowEnabled && (
                    <circle
                      cx={geometry.centerX}
                      cy={geometry.centerY}
                      r={ringRadius}
                      fill="none"
                      stroke={color}
                      strokeWidth={ringConfig.thickness + 5}
                      strokeOpacity="0.55"
                      filter="url(#ring-glow)"
                      className={ringConfig.effect === 'breathing' ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Main Ring Light */}
                  {ringConfig.effect === 'battery_ring' ? (
                    // Battery indicator arc
                    <circle
                      cx={geometry.centerX}
                      cy={geometry.centerY}
                      r={ringRadius}
                      fill="none"
                      stroke={color}
                      strokeWidth={ringConfig.thickness}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${geometry.centerX} ${geometry.centerY})`}
                      className="transition-all duration-300"
                    />
                  ) : ringConfig.effect === 'rotating_sweep' ? (
                    // Rotating orbit ring with transform-origin
                    <g
                      className="animate-spin"
                      style={{
                        transformOrigin: `${geometry.centerX}px ${geometry.centerY}px`,
                        animationDuration: `${ringConfig.speed}s`
                      }}
                    >
                      <circle
                        cx={geometry.centerX}
                        cy={geometry.centerY}
                        r={ringRadius}
                        fill="none"
                        stroke="url(#orbit-grad)"
                        strokeWidth={ringConfig.thickness}
                        strokeLinecap="round"
                        strokeDasharray={`${ringRadius * 3} ${ringRadius * 1.5}`}
                      />
                      {/* Leading bright comet head */}
                      <circle
                        cx={geometry.centerX + ringRadius}
                        cy={geometry.centerY}
                        r={ringConfig.thickness / 2 + 1}
                        fill="#ffffff"
                        filter="url(#ring-glow)"
                      />
                    </g>
                  ) : ringConfig.effect === 'chroma_flow' ? (
                    <g
                      className="animate-spin"
                      style={{
                        transformOrigin: `${geometry.centerX}px ${geometry.centerY}px`,
                        animationDuration: `${ringConfig.speed * 1.5}s`
                      }}
                    >
                      <circle
                        cx={geometry.centerX}
                        cy={geometry.centerY}
                        r={ringRadius}
                        fill="none"
                        stroke="url(#chroma-grad)"
                        strokeWidth={ringConfig.thickness}
                      />
                    </g>
                  ) : (
                    // Standard Breathing or Strobe circle
                    <circle
                      cx={geometry.centerX}
                      cy={geometry.centerY}
                      r={ringRadius}
                      fill="none"
                      stroke={color}
                      strokeWidth={ringConfig.thickness}
                      className={`
                        ${ringConfig.effect === 'breathing' ? 'animate-pulse' : ''}
                        ${ringConfig.effect === 'strobe_alert' ? 'animate-ping' : ''}
                      `}
                    />
                  )}
                </g>
              )}

              {/* DisplayCutout API Bounding Box Overlay for Debugging */}
              {showBoundingBox && (
                <g>
                  {/* Bounding Rect */}
                  <rect
                    x={boundLeft}
                    y={boundTop}
                    width={boundWidth}
                    height={boundHeight}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Center Crosshairs */}
                  <line
                    x1={geometry.centerX - 10}
                    y1={geometry.centerY}
                    x2={geometry.centerX + 10}
                    y2={geometry.centerY}
                    stroke="#f43f5e"
                    strokeWidth="1"
                  />
                  <line
                    x1={geometry.centerX}
                    y1={geometry.centerY - 10}
                    x2={geometry.centerX}
                    y2={geometry.centerY + 10}
                    stroke="#f43f5e"
                    strokeWidth="1"
                  />
                  {/* Geometric Coordinates Text Tag */}
                  <text
                    x={geometry.centerX + (geometry.position === 'right' ? -65 : 20)}
                    y={geometry.centerY + 32}
                    fill="#fda4af"
                    fontSize="9"
                    fontFamily="monospace"
                    className="font-bold select-none"
                  >
                    cx:{Math.round(geometry.centerX)} cy:{Math.round(geometry.centerY)} r:{geometry.radius}
                  </text>
                </g>
              )}
            </svg>

            {/* PHYSICAL HARDWARE CAMERA HOLE (Dark camera lens and optical sensor reflection) */}
            <div
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                left: `${geometry.centerX}px`,
                top: `${geometry.centerY}px`,
                transform: 'translate(-50%, -50%)',
                width: geometry.position === 'pill' ? `${geometry.width || 64}px` : `${geometry.radius * 2}px`,
                height: geometry.position === 'pill' ? `${geometry.height || 24}px` : `${geometry.radius * 2}px`,
                borderRadius: geometry.position === 'pill' ? '9999px' : '50%',
                backgroundColor: '#05070c',
                boxShadow: 'inset 0 0 4px #000000, 0 0 1px rgba(255,255,255,0.2)'
              }}
            >
              {/* Camera optical glass lens reflections */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-slate-950 via-cyan-950/30 to-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20 shadow-inner" />
              </div>
            </div>
          </div>

          {/* Android Navigation Bar Pill at Bottom */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <div className="w-28 h-1 bg-slate-600/60 rounded-full" />
          </div>

        </div>
      </div>

      {/* Live Touch Passthrough Status Banner */}
      <div className="mt-4 w-full max-w-[380px] p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
        <div className="text-[11px] font-mono text-cyan-400 flex items-center justify-center gap-1.5 truncate">
          <MousePointerClick className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{touchLog}</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          بفضل علم <code className="text-slate-300 font-mono">FLAG_NOT_TOUCHABLE</code>: لا تحجب الحلقة العائمة أي نقرة على الشاشة
        </div>
      </div>
    </div>
  );
};
