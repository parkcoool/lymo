package expo.modules.mediainsightservice

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.service.notification.NotificationListenerService
import android.util.Log

class MediaInsightService : NotificationListenerService() {
  
  private var mediaSessionManager: MediaSessionManager? = null
  private var sessionListener: MediaSessionManager.OnActiveSessionsChangedListener? = null
  private var currentController: MediaController? = null
  private var controllerCallback: MediaController.Callback? = null
  private var lastTrackKey = ""
  private var lastNotificationTime = 0L
  
  companion object {
    private const val TAG = "MediaInsightService"
    private const val PREFS_NAME = "lymo_media_insight"
    private const val KEY_NOTIFICATION_FREQUENCY = "notificationFrequency"
    private const val KEY_IS_ENABLED = "isEnabled"
    
    private const val FREQUENCY_ALWAYS = 0L
    private const val FREQUENCY_NORMAL = 60L * 60L * 1000L // 1시간
    private const val FREQUENCY_MINIMAL = 3L * 60L * 60L * 1000L // 3시간
  }
  
  override fun onListenerConnected() {
    super.onListenerConnected()
    
    val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val isEnabled = prefs.getBoolean(KEY_IS_ENABLED, false)
    
    if (isEnabled) {
      startMonitoringMediaSessions()
    }
  }
  
  override fun onListenerDisconnected() {
    super.onListenerDisconnected()
    stopMonitoringMediaSessions()
  }
  
  private fun startMonitoringMediaSessions() {
    if (sessionListener != null) return
    
    try {
      mediaSessionManager = getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
      val componentName = ComponentName(this, MediaInsightService::class.java)
      
      sessionListener = MediaSessionManager.OnActiveSessionsChangedListener { controllers ->
        if (controllers.isNullOrEmpty()) {
          unregisterControllerCallback()
        } else {
          registerControllerCallback(controllers.first())
        }
      }
      
      mediaSessionManager?.addOnActiveSessionsChangedListener(sessionListener!!, componentName)
      
      // 초기 세션 체크
      val activeSessions = mediaSessionManager?.getActiveSessions(componentName)
      if (!activeSessions.isNullOrEmpty()) {
        registerControllerCallback(activeSessions.first())
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error starting media session monitoring", e)
    }
  }
  
  private fun stopMonitoringMediaSessions() {
    unregisterControllerCallback()
    
    sessionListener?.let {
      mediaSessionManager?.removeOnActiveSessionsChangedListener(it)
      sessionListener = null
    }
    mediaSessionManager = null
  }
  
  // MediaController 콜백 등록
  private fun registerControllerCallback(controller: MediaController) {
    unregisterControllerCallback()
    
    currentController = controller
    controllerCallback = object : MediaController.Callback() {
      override fun onMetadataChanged(metadata: android.media.MediaMetadata?) {
        checkAndTrigger(controller)
      }
      
      override fun onPlaybackStateChanged(state: PlaybackState?) {
        checkAndTrigger(controller)
      }
    }
    
    controller.registerCallback(controllerCallback!!)
    checkAndTrigger(controller)
  }
  
  // MediaController 콜백 해제
  private fun unregisterControllerCallback() {
    controllerCallback?.let { callback ->
      currentController?.unregisterCallback(callback)
    }
    currentController = null
    controllerCallback = null
  }
  
  // 미디어 정보 체크 및 Headless Task 트리거
  private fun checkAndTrigger(controller: MediaController) {
    val metadata = controller.metadata
    val playbackState = controller.playbackState
    
    // 재생 중인지 확인
    if (playbackState?.state != PlaybackState.STATE_PLAYING) return
    
    val title = metadata?.getString(android.media.MediaMetadata.METADATA_KEY_TITLE) ?: return
    val artist = metadata?.getString(android.media.MediaMetadata.METADATA_KEY_ARTIST) ?: ""
    val duration = metadata?.getLong(android.media.MediaMetadata.METADATA_KEY_DURATION) ?: 0L
    val packageName = controller.packageName
    
    // 중복 요청 방지 (같은 트랙)
    val trackKey = "$title-$artist"
    if (trackKey == lastTrackKey) return
    
    // 빈도 체크
    if (!shouldTriggerNotification()) return
    
    // 조건 충족 → Headless JS 트리거
    lastTrackKey = trackKey
    lastNotificationTime = System.currentTimeMillis()
    triggerHeadlessTask(title, artist, duration, packageName)
  }
  
  private fun shouldTriggerNotification(): Boolean {
    val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val frequency = prefs.getString(KEY_NOTIFICATION_FREQUENCY, "normal") ?: "normal"
    
    if (frequency == "never") return false
    
    val threshold = when (frequency) {
      "always" -> FREQUENCY_ALWAYS
      "minimal" -> FREQUENCY_MINIMAL
      else -> FREQUENCY_NORMAL
    }
    
    val now = System.currentTimeMillis()
    val delta = now - lastNotificationTime
    
    return delta >= threshold
  }
  
  private fun triggerHeadlessTask(
    title: String,
    artist: String,
    duration: Long,
    packageName: String
  ) {
    try {
      val intent = Intent(this, Class.forName("com.parkcool.lymoapp.MediaHeadlessTaskService"))
      intent.putExtra("title", title)
      intent.putExtra("artist", artist)
      intent.putExtra("duration", duration)
      intent.putExtra("packageName", packageName)
      startService(intent)
    } catch (e: Exception) {
      Log.e(TAG, "Error triggering headless task", e)
    }
  }
}
