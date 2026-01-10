package expo.modules.mediainsightservice

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.core.app.ActivityCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MediaInsightServiceModule : Module() {
  
  companion object {
    private const val REQUEST_CODE_POST_NOTIFICATIONS = 1001
  }
  
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is not available")
  
  override fun definition() = ModuleDefinition {
    Name("MediaInsightService")

    // 서비스 활성화 여부 설정
    Function("setEnabled") { enabled: Boolean ->
      setServiceEnabled(enabled)
    }
    
    // 서비스 활성화 여부 확인
    Function("isEnabled") {
      isServiceEnabled()
    }
    
    // 알림 빈도 설정
    Function("setNotificationFrequency") { frequency: String ->
      setNotificationFrequency(frequency)
    }
    
    // 알림 빈도 가져오기
    Function("getNotificationFrequency") {
      getNotificationFrequency()
    }
    
    // 알림 접근 권한 확인
    Function("hasNotificationListenerPermission") {
      hasNotificationListenerPermission()
    }
    
    // 알림 접근 허용 설정 화면 열기
    Function("openNotificationListenerSettings") {
      openNotificationListenerSettings()
    }
    
    // 알림 표시 권한 확인 (Android 13+)
    Function("hasPostNotificationPermission") {
      hasPostNotificationPermission()
    }
    
    // 알림 표시 권한 요청 (Android 13+)
    Function("requestPostNotificationPermission") {
      requestPostNotificationPermission()
    }
    
    // 인사이트 알림 표시
    Function("showInsightNotification") { title: String, message: String ->
      showInsightNotification(title, message)
    }
  }
  
  private fun setServiceEnabled(enabled: Boolean) {
    val prefs = context.getSharedPreferences("lymo_media_insight", Context.MODE_PRIVATE)
    prefs.edit().putBoolean("isEnabled", enabled).apply()
  }
  
  private fun isServiceEnabled(): Boolean {
    val prefs = context.getSharedPreferences("lymo_media_insight", Context.MODE_PRIVATE)
    return prefs.getBoolean("isEnabled", false)
  }
  
  private fun setNotificationFrequency(frequency: String) {
    val prefs = context.getSharedPreferences("lymo_media_insight", Context.MODE_PRIVATE)
    prefs.edit().putString("notificationFrequency", frequency).apply()
  }
  
  private fun getNotificationFrequency(): String? {
    val prefs = context.getSharedPreferences("lymo_media_insight", Context.MODE_PRIVATE)
    return prefs.getString("notificationFrequency", null)
  }
  
  private fun hasNotificationListenerPermission(): Boolean {
    val enabledListeners = Settings.Secure.getString(
      context.contentResolver,
      "enabled_notification_listeners"
    )
    val packageName = context.packageName
    return enabledListeners?.contains(packageName) == true
  }
  
  private fun openNotificationListenerSettings() {
    val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }
    context.startActivity(intent)
  }
  
  private fun hasPostNotificationPermission(): Boolean {
    // Android 13 미만에서는 권한이 필요 없음
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return true
    }
    
    return ContextCompat.checkSelfPermission(
      context,
      Manifest.permission.POST_NOTIFICATIONS
    ) == PackageManager.PERMISSION_GRANTED
  }
  
  private fun requestPostNotificationPermission() {
    // Android 13 미만에서는 권한이 필요 없음
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return
    }
    
    // 현재 액티비티 가져오기
    val activity = appContext.currentActivity ?: return
    
    // 권한 요청 다이얼로그 표시
    ActivityCompat.requestPermissions(
      activity,
      arrayOf(Manifest.permission.POST_NOTIFICATIONS),
      REQUEST_CODE_POST_NOTIFICATIONS
    )
  }
  
  private fun showInsightNotification(title: String, message: String) {
    val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channelId = "lymo_insight"
    
    // Android 8.0 이상에서는 채널 생성 필요
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "음악 인사이트",
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        description = "재생 중인 음악에 대한 인사이트 알림"
      }
      notificationManager.createNotificationChannel(channel)
    }
    
    // 앱 실행 Intent
    val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    
    val pendingIntent = PendingIntent.getActivity(
      context,
      0,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    
    // 알림 생성
    val notification = NotificationCompat.Builder(context, channelId)
      .setContentTitle(title)
      .setContentText(message)
      .setStyle(NotificationCompat.BigTextStyle().bigText(message))
      .setSmallIcon(getNotificationIcon())
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)
      .setAutoCancel(true)
      .setContentIntent(pendingIntent)
      .build()
    
    notificationManager.notify(System.currentTimeMillis().toInt(), notification)
  }
  
  private fun getNotificationIcon(): Int {
    val notificationIconId = context.resources.getIdentifier(
      "notification_icon",
      "drawable",
      context.packageName
    )
    
    if (notificationIconId != 0) {
      return notificationIconId
    }
    
    return context.applicationInfo.icon
  }
}
