import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowDown, 
  Layers, 
  Cpu, 
  Radio, 
  Eye, 
  Maximize, 
  Info,
  ChevronLeft 
} from 'lucide-react';

interface ArchitectureFlowDiagramProps {
  activeStep?: number;
  onSelectStep?: (step: number) => void;
  onSelectComponent?: (componentId: string) => void;
}

export const ArchitectureFlowDiagram: React.FC<ArchitectureFlowDiagramProps> = ({
  activeStep = 3,
  onSelectStep,
  onSelectComponent
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('overlay');

  const FLOW_STEPS = [
    {
      id: 'listener',
      stepNumber: '01',
      stepNum: 1,
      title: '1. محرك التقاط الإشعارات وفك الألوان (NotificationListenerService)',
      badge: 'IPC Service Hook',
      desc: 'يستقبل حدث onNotificationPosted() عبر معمارية Binder IPC، ويتحقق من أهمية الإشعار، ويستخرج لون التطبيق الهوياتي (مثل الأخضر لـ WhatsApp والأزرق لـ Telegram).',
      componentId: 'notification-listener'
    },
    {
      id: 'geometry',
      stepNumber: '02',
      stepNum: 2,
      title: '2. محرك كشف ثقب الكاميرا (DisplayCutout Engine)',
      badge: 'WindowInsets API',
      desc: 'يستعلم عن أبعاد الشاشة وحيز النتوء عبر boundingRects، ويحسب مركز الثقب (cx, cy) ونصف القطر R مع مصفوفة المعايرة الدقيقة.',
      componentId: 'cutout-engine'
    },
    {
      id: 'overlay',
      stepNumber: '03',
      stepNum: 3,
      title: '3. مدير الطبقة العائمة (Overlay WindowManager)',
      badge: 'Hardware Surface',
      desc: 'ينشئ نافذة TYPE_APPLICATION_OVERLAY مع علم FLAG_NOT_TOUCHABLE لضمان عدم اعتراض اللمس وتمرير كل نقرة للتطبيق بالخلفية.',
      componentId: 'overlay-window-manager'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          مخطط تدفق البيانات ومعمارية النظام (System Architecture Flowchart)
        </h3>
        <span className="text-[11px] text-slate-400">تدفق تسلسلي تكاملي</span>
      </div>

      <div className="space-y-3">
        {FLOW_STEPS.map((step, idx) => {
          const isSelected = activeStep === step.stepNum || selectedNode === step.id;
          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  setSelectedNode(step.id);
                  onSelectStep?.(step.stepNum);
                  onSelectComponent?.(step.componentId);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step.stepNumber}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{step.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{step.desc}</p>
                </div>

                <ChevronLeft className="w-4 h-4 text-slate-500 self-center shrink-0" />
              </div>

              {idx < FLOW_STEPS.length - 1 && (
                <div className="flex justify-center -my-1">
                  <ArrowDown className="w-4 h-4 text-cyan-500/60" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
