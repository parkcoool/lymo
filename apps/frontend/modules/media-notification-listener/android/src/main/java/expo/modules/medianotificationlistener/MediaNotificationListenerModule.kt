package expo.modules.medianotificationlistener

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.os.Build
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MediaNotificationListenerModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is not available")
  
  private var mediaSessionManager: MediaSessionManager? = null
  private var sessionListener: MediaSessionManager.OnActiveSessionsChangedListener? = null
  
  override fun definition() = ModuleDefinition {
    Name("MediaNotificationListener")

    // 이벤트
    Events("onMediaSessionChanged")

    // 현재 미디어 세션 정보 가져오기
    AsyncFunction("getCurrentMediaSession") {
      getCurrentMediaSessionInfo()
    }

    // 알림 접근 권한 확인
    Function("hasNotificationListenerPermission") {
      hasNotificationListenerPermission()
    }

    // 알림 접근 허용 설정 화면 열기
    Function("openNotificationListenerSettings") {
      openNotificationListenerSettings()
    }

    // 미디어 세션 관찰 시작
    AsyncFunction("startObservingMediaSession") {
      startObservingMediaSession()
    }

    // 미디어 세션 관찰 중지
    Function("stopObservingMediaSession") {
      stopObservingMediaSession()
    }

    OnDestroy {
      cleanup()
    }
  }

  // 현재 활성 미디어 세션 정보를 가져오는 함수
  private fun getCurrentMediaSessionInfo(): Map<String, Any?> {
    if (!hasNotificationListenerPermission()) {
      throw IllegalStateException("Notification listener permission not granted")
    }

    val manager = getMediaSessionManager()
    val componentName = ComponentName(context, MediaNotificationListenerService::class.java)
    val controllers = manager.getActiveSessions(componentName)

    if (controllers.isEmpty()) {
      return mapOf("hasSession" to false)
    }

    // 첫 번째 활성 세션 가져오기
    val controller = controllers.firstOrNull() ?: return mapOf("hasSession" to false)
    
    return buildMediaSessionInfo(controller)
  }
 
  // 미디어 세션 정보 맵을 생성하는 함수
  private fun buildMediaSessionInfo(controller: MediaController): Map<String, Any?> {
    val metadata = controller.metadata
    val playbackState = controller.playbackState

    return mapOf(
      "hasSession" to true,
      "packageName" to controller.packageName,
      "title" to metadata?.getString(android.media.MediaMetadata.METADATA_KEY_TITLE),
      "artist" to metadata?.getString(android.media.MediaMetadata.METADATA_KEY_ARTIST),
      "album" to metadata?.getString(android.media.MediaMetadata.METADATA_KEY_ALBUM),
      "durationInMs" to metadata?.getLong(android.media.MediaMetadata.METADATA_KEY_DURATION),
      "position" to playbackState?.position,
      "playbackSpeed" to playbackState?.playbackSpeed,
      "state" to getPlaybackStateName(playbackState?.state),
      "isPlaying" to (playbackState?.state == PlaybackState.STATE_PLAYING)
    )
  }

  // 재생 상태를 문자열로 변환하는 함수
  private fun getPlaybackStateName(state: Int?): String? {
    return when (state) {
      PlaybackState.STATE_NONE -> "none"
      PlaybackState.STATE_STOPPED -> "stopped"
      PlaybackState.STATE_PAUSED -> "paused"
      PlaybackState.STATE_PLAYING -> "playing"
      PlaybackState.STATE_FAST_FORWARDING -> "fast_forwarding"
      PlaybackState.STATE_REWINDING -> "rewinding"
      PlaybackState.STATE_BUFFERING -> "buffering"
      PlaybackState.STATE_ERROR -> "error"
      PlaybackState.STATE_CONNECTING -> "connecting"
      PlaybackState.STATE_SKIPPING_TO_PREVIOUS -> "skipping_to_previous"
      PlaybackState.STATE_SKIPPING_TO_NEXT -> "skipping_to_next"
      PlaybackState.STATE_SKIPPING_TO_QUEUE_ITEM -> "skipping_to_queue_item"
      else -> null
    }
  }

  // 알림 접근 권한을 확인하는 함수
  private fun hasNotificationListenerPermission(): Boolean {
    val enabledListeners = Settings.Secure.getString(
      context.contentResolver,
      "enabled_notification_listeners"
    )
    val packageName = context.packageName
    return enabledListeners?.contains(packageName) == true
  }

  // 알림 접근 설정 화면을 여는 함수
  private fun openNotificationListenerSettings() {
    val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }
    context.startActivity(intent)
  }

  // MediaSessionManager 인스턴스를 가져오는 함수
  private fun getMediaSessionManager(): MediaSessionManager {
    if (mediaSessionManager == null) {
      mediaSessionManager = context.getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
    }
    return mediaSessionManager!!
  }

  // 미디어 세션 관찰을 시작하는 함수
  private fun startObservingMediaSession() {
    if (!hasNotificationListenerPermission()) {
      throw IllegalStateException("Notification listener permission not granted")
    }

    stopObservingMediaSession()

    val manager = getMediaSessionManager()
    val componentName = ComponentName(context, MediaNotificationListenerService::class.java)
    
    sessionListener = MediaSessionManager.OnActiveSessionsChangedListener { controllers ->
      val sessionInfo = if (controllers.isNullOrEmpty()) {
        mapOf("hasSession" to false)
      } else {
        buildMediaSessionInfo(controllers.first())
      }
      
      sendEvent("onMediaSessionChanged", sessionInfo)
    }

    manager.addOnActiveSessionsChangedListener(sessionListener!!, componentName)
  }

  // 미디어 세션 관찰을 중지하는 함수
  private fun stopObservingMediaSession() {
    sessionListener?.let {
      mediaSessionManager?.removeOnActiveSessionsChangedListener(it)
      sessionListener = null
    }
  }

  private fun cleanup() {
    stopObservingMediaSession()
    mediaSessionManager = null
  }
}
