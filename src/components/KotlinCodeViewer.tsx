import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../data/architectureData';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FileText,
  Terminal,
  ShieldAlert
} from 'lucide-react';

interface KotlinCodeViewerProps {
  onCopySnippet: (text: string) => void;
}

export const KotlinCodeViewer: React.FC<KotlinCodeViewerProps> = ({
  onCopySnippet
}) => {
  const [activeTab, setActiveTab] = useState<keyof typeof CODE_SNIPPETS>('windowManagerOverlay');
  const [copied, setCopied] = useState(false);

  const tabs: { key: keyof typeof CODE_SNIPPETS; title: string; filename: string; badge: string }[] = [
    {
      key: 'windowManagerOverlay',
      title: 'الطبقة العائمة (WindowManager)',
      filename: 'OverlayWindowManager.kt',
      badge: 'Component 3'
    },
    {
      key: 'cutoutEngine',
      title: 'محرك حساب الثقب (DisplayCutout)',
      filename: 'CutoutDetectorHelper.kt',
      badge: 'Component 2'
    },
    {
      key: 'notificationListener',
      title: 'التقاط الإشعارات وفك الألوان',
      filename: 'HolePunchNotificationListener.kt',
      badge: 'Component 1'
    },
    {
      key: 'canvasRingView',
      title: 'رسم الحلقة والتوهج (Canvas)',
      filename: 'HolePunchRingView.kt',
      badge: 'Custom View'
    },
    {
      key: 'androidManifest',
      title: 'ملف التصاريح (Manifest)',
      filename: 'AndroidManifest.xml',
      badge: 'Permissions'
    }
  ];

  const currentSnippet = CODE_SNIPPETS[activeTab];

  const handleCopy = () => {
    onCopySnippet(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const activeItem = tabs.find(t => t.key === activeTab);
    const filename = activeItem ? activeItem.filename : 'CodeSnippet.kt';
    const blob = new Blob([currentSnippet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={String(tab.key)}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{tab.filename}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 rounded-lg border border-cyan-800/80 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل الملف</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed dir-ltr text-left max-h-[540px]">
        <pre className="selection:bg-cyan-500/30">{currentSnippet}</pre>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>جاهز للنسخ واللصق مباشرة في مشروع Android Studio (Kotlin 1.9+ / SDK 34)</span>
        </div>
        <span className="font-mono text-slate-500">Android API 28 - API 35 Compatible</span>
      </div>
    </div>
  );
};
