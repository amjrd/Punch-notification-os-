import { AppNotification, ArchitectureComponent, CutoutGeometry } from '../types';

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'wa-1',
    packageName: 'com.whatsapp',
    appName: 'WhatsApp',
    appColor: '#25D366',
    secondaryColor: '#128C7E',
    title: 'أحمد علي',
    message: 'السلام عليكم، هل اطلعت على تصميم المعمارية البرمجية؟',
    timestamp: 'الآن',
    iconName: 'MessageSquare',
    priority: 'high'
  },
  {
    id: 'tg-1',
    packageName: 'org.telegram.messenger',
    appName: 'Telegram',
    appColor: '#2AABEE',
    secondaryColor: '#229ED9',
    title: 'قناة مطوري أندرويد',
    message: 'تم تحديث توثيق DisplayCutout API في نظام Android 15',
    timestamp: 'منذ دقيقة',
    iconName: 'Send',
    priority: 'high'
  },
  {
    id: 'ig-1',
    packageName: 'com.instagram.android',
    appName: 'Instagram',
    appColor: '#E1306C',
    secondaryColor: '#F77737',
    title: 'نور الهدى',
    message: 'أرسل لك مقطع فيديو جديد في الرسائل الخاصة',
    timestamp: 'منذ 3 دقائق',
    iconName: 'Instagram',
    priority: 'default'
  },
  {
    id: 'call-1',
    packageName: 'com.google.android.dialer',
    appName: 'Phone (مكالمة فائتة)',
    appColor: '#10B981',
    secondaryColor: '#059669',
    title: 'مكالمة فائتة',
    message: 'مكالمة واردة لم يرد عليها من المهندس خالد',
    timestamp: 'منذ 5 دقائق',
    iconName: 'PhoneCall',
    priority: 'urgent'
  },
  {
    id: 'mail-1',
    packageName: 'com.google.android.gm',
    appName: 'Gmail',
    appColor: '#EA4335',
    secondaryColor: '#B31412',
    title: 'Google Play Console',
    message: 'تمت الموافقة على نشر تحديث تطبيق ثقب الكاميرا',
    timestamp: 'منذ 12 دقيقة',
    iconName: 'Mail',
    priority: 'default'
  },
  {
    id: 'batt-1',
    packageName: 'com.android.systemui.battery',
    appName: 'System Battery (البطارية)',
    appColor: '#F59E0B',
    secondaryColor: '#EF4444',
    title: 'البطارية منخفضة',
    message: 'المتبقي 18% - تم تفعيل وضع توفير الطاقة تلقائياً',
    timestamp: 'الآن',
    iconName: 'BatteryAlert',
    priority: 'urgent'
  }
];

export const PRESET_NOTIFICATIONS = DEFAULT_NOTIFICATIONS;

export const CUTOUT_PRESETS: Record<string, CutoutGeometry> = {
  center: {
    position: 'center',
    centerX: 190,
    centerY: 28,
    radius: 12
  },
  left: {
    position: 'left',
    centerX: 48,
    centerY: 28,
    radius: 12
  },
  right: {
    position: 'right',
    centerX: 332,
    centerY: 28,
    radius: 12
  },
  pill: {
    position: 'pill',
    centerX: 190,
    centerY: 28,
    radius: 14,
    width: 64,
    height: 24
  },
  notch: {
    position: 'notch',
    centerX: 190,
    centerY: 14,
    radius: 16,
    notchDepth: 28
  }
};

export const CODE_SNIPPETS = {
  windowManagerOverlay: `/**
 * المكون 3: إنشاء طبقة العرض العائمة (Overlay Window Manager)
 * يتم استخدام TYPE_APPLICATION_OVERLAY مع الأعلام المانعة لاعتراض اللمس.
 * لاحظ ضبط PixelFormat إلى TRANSLUCENT (32-bit ARGB شفاف بالكامل).
 */
package com.holelight.engine

import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.view.Gravity
import android.view.WindowManager

class OverlayWindowManager(private val context: Context) {

    private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    private var overlayRingView: HolePunchRingView? = null

    fun attachOverlay() {
        if (overlayRingView != null) return

        overlayRingView = HolePunchRingView(context)

        // إعداد معلمات النافذة العائمة (Critical LayoutParams)
        val params = WindowManager.LayoutParams().apply {
            // استخدام نوع TYPE_APPLICATION_OVERLAY لنظام Android 8.0 (API 26+)
            type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            } else {
                @Suppress("DEPRECATION")
                WindowManager.LayoutParams.TYPE_PHONE
            }

            // أعلام حاسمة لضمان عدم اعتراض لمس المستخدم:
            // 1. FLAG_NOT_FOCUSABLE: النافذة لا تسحب تركيز لوحة المفاتيح
            // 2. FLAG_NOT_TOUCHABLE: عدم اعتراض أحداث اللمس نهائياً (كل اللمسات تعبر للتطبيقات خلفها)
            // 3. FLAG_LAYOUT_IN_SCREEN & NO_LIMITS: الامتداد لأعلى الشاشة وتجاوز شريط الحالة ليحيط بالثقب
            flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                    WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS

            // نافذة شفافة بالكامل
            format = PixelFormat.TRANSLUCENT

            // التثبيت بأعلى اليسار للتطابق مع إحداثيات الشاشة (0,0)
            gravity = Gravity.TOP or Gravity.START
            x = 0
            y = 0

            width = WindowManager.LayoutParams.MATCH_PARENT
            height = WindowManager.LayoutParams.MATCH_PARENT
        }

        windowManager.addView(overlayRingView, params)
    }

    fun detachOverlay() {
        overlayRingView?.let {
            windowManager.removeView(it)
            overlayRingView = null
        }
    }
}`,

  cutoutEngine: `/**
 * المكون 2: كشف وتحديد موضع ثقب الكاميرا بدقة (Cutout Engine)
 * استخدام واجهة DisplayCutout (Android 9 Pie - API 28+)
 */
package com.holelight.engine

import android.graphics.Rect
import android.os.Build
import android.view.DisplayCutout
import android.view.WindowInsets
import androidx.annotation.RequiresApi

data class CutoutCoords(
    val centerX: Float,
    val centerY: Float,
    val radius: Float
)

object CutoutDetectorHelper {

    @RequiresApi(Build.VERSION_CODES.P)
    fun extractCameraCutout(windowInsets: WindowInsets): CutoutCoords? {
        val cutout: DisplayCutout = windowInsets.displayCutout ?: return null
        val bounds: List<Rect> = cutout.boundingRects

        if (bounds.isEmpty()) return null

        // نتوء الكاميرا الأمامية يقع عادة في أعلى الشاشة (top <= 200px)
        val cameraRect = bounds.firstOrNull { it.top <= 200 } ?: bounds[0]

        // حساب مركز الثقب رياضياً:
        val cx = cameraRect.exactCenterX()
        val cy = cameraRect.exactCenterY()

        // حساب نصف القطر (نصف أكبر ضلع + هامش أمان 2dp)
        val w = cameraRect.width().toFloat()
        val h = cameraRect.height().toFloat()
        val radius = (maxOf(w, h) / 2f) + 4f

        return CutoutCoords(cx, cy, radius)
    }
}`,

  notificationListener: `/**
 * المكون 1: التقاط الإشعارات وفك لون التطبيق المرسل (NotificationListenerService)
 * استخراج اللون عبر خاصية color أو مكتبة Palette على أيقونة التطبيق.
 */
package com.holelight.engine

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import androidx.palette.graphics.Palette

class HolePunchNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        sbn ?: return

        // استبعاد الإشعارات المستمرة مثل تحميل الملفات أو تشغيل الموسيقى
        if (sbn.isOngoing) return

        val pkgName = sbn.packageName
        val notification = sbn.notification

        // 1. استخراج اللون الصريح المرفق بالإشعار
        var resolvedColor = notification.color

        // 2. إذا لم يكن اللون محدداً، يتم استخراجه من أيقونة التطبيق عبر Palette
        if (resolvedColor == 0 || resolvedColor == Color.TRANSPARENT) {
            resolvedColor = extractDominantColor(pkgName)
        }

        // إرسال اللون لمحرك الحلقة العائمة
        OverlayController.notifyNewEvent(
            pkg = pkgName,
            color = resolvedColor
        )
    }

    private fun extractDominantColor(packageName: String): Int {
        return try {
            val icon = packageManager.getApplicationIcon(packageName)
            val bitmap = (icon as? BitmapDrawable)?.bitmap ?: return Color.CYAN
            val palette = Palette.from(bitmap).generate()
            palette.getVibrantColor(palette.getDominantColor(Color.CYAN))
        } catch (e: Exception) {
            Color.CYAN
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        OverlayController.onNotificationDismissed(sbn?.packageName)
    }
}`,

  canvasRingView: `/**
 * محرك الرسم المسرع عتادياً لرسم الحلقة وتدرج الوهج (Hardware Canvas & Paint)
 */
package com.holelight.engine

import android.content.Context
import android.graphics.*
import android.view.View
import android.animation.ValueAnimator
import android.view.animation.LinearInterpolator

class HolePunchRingView(context: Context) : View(context) {

    var cx: Float = 190f
    var cy: Float = 28f
    var radius: Float = 14f
    var strokeWidth: Float = 4f
    var ringColor: Int = Color.parseColor("#25D366")

    private var currentRotation: Float = 0f
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeCap = Paint.Cap.ROUND
    }

    init {
        setLayerType(LAYER_TYPE_HARDWARE, null)
        ValueAnimator.ofFloat(0f, 360f).apply {
            duration = 1800L
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            addUpdateListener {
                currentRotation = it.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        paint.strokeWidth = strokeWidth

        val sweepGradient = SweepGradient(
            cx, cy,
            intArrayOf(Color.TRANSPARENT, ringColor, ringColor),
            floatArrayOf(0f, 0.7f, 1f)
        )
        val matrix = Matrix()
        matrix.postRotate(currentRotation, cx, cy)
        sweepGradient.setLocalMatrix(matrix)
        paint.shader = sweepGradient

        canvas.drawCircle(cx, cy, radius, paint)
    }
}`,

  androidManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.holelight.studio">

    <!-- الصلاحيات المطلوبة -->
    <!-- 1. إظهار الطبقة العائمة فوق كافة التطبيقات دون حجب اللمس -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    
    <!-- 2. تشغيل كخدمة أمامية لمنع القتل من قبل موفري الطاقة -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    
    <!-- 3. إدارة استيقاظ الشاشة في وضع AOD (Always on Display) -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Hole Punch Light Studio"
        android:supportsRtl="true"
        android:theme="@style/Theme.HoleLight">

        <!-- تسجيل خدمة التنصت على الإشعارات -->
        <service
            android:name=".HolePunchNotificationListener"
            android:label="Hole Light Notification Listener"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <!-- خدمة الطبقة العائمة -->
        <service
            android:name=".OverlayWindowManagerService"
            android:foregroundServiceType="specialUse"
            android:exported="false" />

    </application>
</manifest>`
};

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'notification-listener',
    titleAr: '1. محرك التقاط الإشعارات وترجمة الألوان',
    titleEn: 'NotificationListenerService & Color Resolver',
    badge: 'IPC & Notification Subsystem',
    summary: 'يعمل كخدمة في الخلفية ترتبط بـ NotificationManagerService عبر Binder IPC. يتنصت على جميع الإشعارات الواردة، ويستخرج اللون المميّز للتطبيق باستخدام عدة استراتيجيات تبدأ من خاصية color في الإشعار ثم مكتبة AndroidX Palette على أيقونة التطبيق.',
    keyClasses: [
      'NotificationListenerService',
      'StatusBarNotification',
      'NotificationChannel',
      'androidx.palette.graphics.Palette'
    ],
    permissions: [
      'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE'
    ],
    challenges: [
      'تحديد اللون في حال كانت أيقونة التطبيق بيضاء أحادية اللون في Material You.',
      'تجاهل إشعارات النظام المستمرة مثل تشغيل الموسيقى أو تنزيل الملفات.',
      'حماية الخصوصية ومنع قراءة محتوى الرسائل المشفرة.'
    ],
    codeSnippet: CODE_SNIPPETS.notificationListener
  },
  {
    id: 'cutout-engine',
    titleAr: '2. محرك كشف أبعاد وموضع ثقب الكاميرا',
    titleEn: 'DisplayCutout API & Geometry Engine',
    badge: 'WindowInsets & Display Metrics',
    summary: 'يقوم بالاستعلام عن الشاشات المزودة بنتوء أو ثقب كاميرا عبر واجهة DisplayCutout المتاحة بدءاً من أندرويد 9 (API 28). يحسب مركز الثقب الدقيق (cx, cy) ونصف القطر للرسم المحيطي.',
    keyClasses: [
      'android.view.DisplayCutout',
      'android.view.WindowInsets',
      'android.graphics.Rect',
      'android.util.DisplayMetrics'
    ],
    permissions: [
      'لا تتطلب صلاحية خاصة (جزء من واجهة WindowInsets العامة)'
    ],
    challenges: [
      'اختلاف إحداثيات الثقب عند تدوير الشاشة (Portrait مقابل Landscape).',
      'وجود أجهزة قديمة أو واجهات معدلة لا تُرجع boundingRects بدقة.',
      'توفير أداة معايرة بكسلية يدوية للمستخدمين لتصحيح الإزاحة بدقة 1px.'
    ],
    codeSnippet: CODE_SNIPPETS.cutoutEngine
  },
  {
    id: 'overlay-window-manager',
    titleAr: '3. مدير الطبقة العائمة ومحرك الرسم الشفاف',
    titleEn: 'Overlay WindowManager & Hardware Canvas',
    badge: 'Hardware Surface & Non-Blocking Overlay',
    summary: 'المسؤول عن حقن نافذة عرض عائمة فوق كامل شاشة الهاتف بما في ذلك شريط الحالة ومنطقة الثقب مع رايات عدم اعتراض اللمس حتى تظل الشاشة تفاعلية 100%.',
    keyClasses: [
      'android.view.WindowManager',
      'WindowManager.LayoutParams',
      'android.graphics.PixelFormat',
      'android.graphics.Paint',
      'android.graphics.SweepGradient'
    ],
    permissions: [
      'android.permission.SYSTEM_ALERT_WINDOW'
    ],
    challenges: [
      'حماية البطارية ومنع إبقاء معالج الهاتف مستيقظاً أثناء قفل الشاشة.',
      'تطبيق إزاحة مضادة لحرق شاشات OLED (Burn-in Protection).',
      'التوافق مع شاشات الإلغاء والقفل Always-On Display (AOD).'
    ],
    codeSnippet: CODE_SNIPPETS.windowManagerOverlay
  }
];

export const ANDROID_MANIFEST_XML = CODE_SNIPPETS.androidManifest;
export const CANVAS_VIEW_KOTLIN = CODE_SNIPPETS.canvasRingView;
