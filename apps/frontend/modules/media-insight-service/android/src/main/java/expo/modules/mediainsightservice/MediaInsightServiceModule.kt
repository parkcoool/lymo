package expo.modules.mediainsightservice

import android.content.Context
import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MediaInsightServiceModule : Module() {
  
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
  
  private fun getNotificationFrequency(): String {
    val prefs = context.getSharedPreferences("lymo_media_insight", Context.MODE_PRIVATE)
    return prefs.getString("notificationFrequency", "normal") ?: "normal"
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
}
