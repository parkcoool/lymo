package expo.modules.medianotificationlistener

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.os.Build
import android.provider.Settings
import android.util.Base64
import android.util.Log
import androidx.core.app.NotificationManagerCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class MediaNotificationListenerModule : Module() {
  
  companion object {
    private const val TAG = "MediaNotiListenerModule"
  }
  
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is not available")
  
  private var mediaSessionManager: MediaSessionManager? = null
  private var sessionListener: MediaSessionManager.OnActiveSessionsChangedListener? = null
  private var currentController: MediaController? = null
  private var controllerCallback: MediaController.Callback? = null
  private var lastTrackId: String? = null
  private var lastEncodedAlbumArt: String? = null
  
  override fun definition() = ModuleDefinition {
    Name("MediaNotificationListener")

    // 이벤트
    Events("onMediaSessionChanged")

    // 현재 미디어 세션 정보 가져오기
    Function("getCurrentMediaSession") {
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
      "isPlaying" to (playbackState?.state == PlaybackState.STATE_PLAYING),
      "albumArtBase64" to getAlbumArtBase64(metadata)
    )
  }

  // 앨범 아트를 base64로 인코딩하는 함수
  private fun getAlbumArtBase64(metadata: android.media.MediaMetadata?): String? {
    if (metadata == null) {
      lastTrackId = null
      lastEncodedAlbumArt = null
      return null
    }

    val title = metadata.getString(android.media.MediaMetadata.METADATA_KEY_TITLE) ?: ""
    val artist = metadata.getString(android.media.MediaMetadata.METADATA_KEY_ARTIST) ?: ""

    // 제목, 아티스트를 조합하여 고유 ID 생성
    val currentTrackId = "${title}-${artist}"

    // 같은 트랙이면 기존 인코딩된 이미지 재사용
    if (currentTrackId == lastTrackId && lastEncodedAlbumArt != null) {
      return lastEncodedAlbumArt
    }
    
    lastTrackId = currentTrackId
    val bitmap = metadata.getBitmap(android.media.MediaMetadata.METADATA_KEY_ALBUM_ART)

    if (bitmap == null) {
      lastEncodedAlbumArt = null
      return null
    }
    
    return try {
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray = byteArrayOutputStream.toByteArray()
      val encoded = "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP)
      lastEncodedAlbumArt = encoded
      encoded
    } catch (e: Exception) {
      // 인코딩 실패 시 캐시 초기화하지 않음 (다음 시도 위해)
      // 다만 현재 트랙에 대한 인코딩이 실패했으므로 null 반환
      null
    }
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
      Log.d(TAG, "Active sessions changed: ${controllers?.size ?: 0} sessions")
      
      if (controllers.isNullOrEmpty()) {
        sendEvent("onMediaSessionChanged", mapOf("hasSession" to false))
        unregisterControllerCallback()
      } else {
        val controller = controllers.first()
        registerControllerCallback(controller)
        sendMediaSessionInfo(controller)
      }
    }

    try {
      manager.addOnActiveSessionsChangedListener(sessionListener!!, componentName)
      Log.d(TAG, "Successfully added session listener")
      
      // 초기 세션 등록
      val activeSessions = manager.getActiveSessions(componentName)
      if (activeSessions.isNotEmpty()) {
        registerControllerCallback(activeSessions.first())
      }
    } catch (e: Exception) {
      Log.e(TAG, "Failed to add session listener", e)
      throw e
    }
  }
  
  // MediaController 콜백 등록
  private fun registerControllerCallback(controller: MediaController) {
    // 기존 콜백 해제
    unregisterControllerCallback()
    
    currentController = controller
    controllerCallback = object : MediaController.Callback() {
      override fun onMetadataChanged(metadata: android.media.MediaMetadata?) {
        Log.d(TAG, "Metadata changed: ${metadata?.getString(android.media.MediaMetadata.METADATA_KEY_TITLE)}")
        sendMediaSessionInfo(controller)
      }
      
      override fun onPlaybackStateChanged(state: PlaybackState?) {
        Log.d(TAG, "Playback state changed: ${state?.state}")
        sendMediaSessionInfo(controller)
      }
    }
    
    controller.registerCallback(controllerCallback!!)
    Log.d(TAG, "Registered controller callback for ${controller.packageName}")
  }
  
  // MediaController 콜백 해제
  private fun unregisterControllerCallback() {
    controllerCallback?.let { callback ->
      currentController?.unregisterCallback(callback)
      Log.d(TAG, "Unregistered controller callback")
    }
    currentController = null
    controllerCallback = null
    lastTrackId = null
    lastEncodedAlbumArt = null
  }
  
  // 미디어 세션 정보를 이벤트로 전송
  private fun sendMediaSessionInfo(controller: MediaController) {
    val sessionInfo = buildMediaSessionInfo(controller)
    sendEvent("onMediaSessionChanged", sessionInfo)
  }

  // 미디어 세션 관찰을 중지하는 함수
  private fun stopObservingMediaSession() {
    unregisterControllerCallback()
    
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
