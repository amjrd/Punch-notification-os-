import React, { useState } from 'react';
import { AppNotification } from '../types';
import { DEFAULT_NOTIFICATIONS } from '../data/architectureData';
import { 
  BellRing, 
  Send, 
  Palette, 
  Check, 
  Sparkles, 
  Sliders, 
  Info,
  ShieldAlert,
  Plus
} from 'lucide-react';

interface NotificationColorResolverProps {
  activeNotification: AppNotification | null;
  onSelectNotification: (notif: AppNotification | null) => void;
  onColorChange: (color: string) => void;
}

export const NotificationColorResolver: React.FC<NotificationColorResolverProps> = ({
  activeNotification,
  onSelectNotification,
  onColorChange
}) => {
  const [customAppName, setCustomAppName] = useState('');
  const [customPackage, setCustomPackage] = useState('com.custom.app');
  const [customColor, setCustomColor] = useState('#a855f7');
  const [customTitle, setCustomTitle] = useState('إشعار تجريبي جديد');
  const [resolutionMode, setResolutionMode] = useState<'preset' | 'palette' | 'notification_color'>('preset');

  const handleTriggerCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif: AppNotification = {
      id: `custom-${Date.now()}`,
      packageName: customPackage || 'com.app.custom',
      appName: customAppName || 'تطبيق مخصص',
      appColor: customColor,
      title: customTitle,
      message: 'تم استخراج اللون وتشغيل إضاءة ثقب الكاميرا بنجاح!',
      timestamp: 'الآن',
      iconName: 'Bell',
      priority: 'high'
    };
    onSelectNotification(newNotif);
    onColorChange(customColor);
  };

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                المكون 1: خدمة التقاط الإشعارات وفك ترميز الألوان
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                NotificationListenerService & Color Resolver Engine
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-800/80">
            IPC Interception Active
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          يقوم نظام Android بإشعار التطبيق عند وصول أي <code className="text-cyan-300 font-mono">StatusBarNotification</code>.
          تقوم خوارزمية الفحص بتحديد اللون الأنسب للإضاءة تلقائياً عبر ثلاثة مستويات متتالية:
        </p>

        {/* 3 Resolution Layers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span>1. لون كائن الإشعار</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              فحص <code className="text-slate-300 font-mono">notification.color</code> المرسل مباشرة من التطبيق المصدر.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>2. جدول مطابقة الحزم</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              مطابقة الحزم الشائعة مثل <code className="text-slate-300 font-mono">com.whatsapp</code> (أخضر #25D366) و <code className="text-slate-300 font-mono">org.telegram.messenger</code> (أزرق #2AABEE).
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="font-semibold text-purple-400 mb-1 flex items-center gap-1.5">
              <span>3. استخراج الباليت من الأيقونة</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              استخدام <code className="text-slate-300 font-mono">Palette.from(appIconBitmap)</code> لاستخراج اللون المهيمن حيوياً.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Notifications Simulator */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>اختبار وصول إشعارات التطبيقات الحقيقية</span>
            <span className="text-xs font-normal text-slate-400">(انقر لإرسال الإشعار للمحاكي)</span>
          </h4>
          {activeNotification && (
            <button
              onClick={() => onSelectNotification(null)}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              إلغاء الإشعار النشط
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEFAULT_NOTIFICATIONS.map((notif: AppNotification) => {
            const isSelected = activeNotification?.id === notif.id;
            return (
              <button
                key={notif.id}
                onClick={() => {
                  onSelectNotification(notif);
                  onColorChange(notif.appColor);
                }}
                className={`text-right p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white font-bold"
                  style={{ backgroundColor: notif.appColor }}
                >
                  <span className="text-sm">{notif.appName.slice(0, 1)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{notif.appName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-cyan-400/90 font-mono truncate">{notif.packageName}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{notif.title}</div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 left-2 text-cyan-400">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom App & Color Creator */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>محاكاة تطبيق مخصص وتحديد لون ثقب الكاميرا يدوياً</span>
        </h4>

        <form onSubmit={handleTriggerCustom} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">اسم التطبيق</label>
            <input
              type="text"
              value={customAppName}
              onChange={(e) => setCustomAppName(e.target.value)}
              placeholder="مثال: سناب شات"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">حزمة التطبيق (Package Name)</label>
            <input
              type="text"
              value={customPackage}
              onChange={(e) => setCustomPackage(e.target.value)}
              placeholder="com.snapchat.android"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">اللون المستخرج (App Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onColorChange(e.target.value);
                }}
                className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onColorChange(e.target.value);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إرسال الإشعار للمحاكي</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
