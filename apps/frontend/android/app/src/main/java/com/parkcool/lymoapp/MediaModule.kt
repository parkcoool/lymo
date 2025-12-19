package com.parkcool.lymoapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.provider.Settings
import android.graphics.Bitmap
import android.util.Base64
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.ByteArrayOutputStream

class MediaModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var mediaController: MediaController? = null
    private val context: ReactApplicationContext = reactContext

    init {
        MediaNotificationListener.setModule(this)
    }

    override fun getName() = "MediaModule"

    private val controllerCallback = object : MediaController.Callback() {
        override fun onMetadataChanged(metadata: MediaMetadata?) {
            sendMediaData()
        }

        override fun onPlaybackStateChanged(state: PlaybackState?) {
            sendMediaData()
        }
    }

    fun updateMediaController(controller: MediaController?) {
        try {
            mediaController?.unregisterCallback(controllerCallback)
        } catch (e: Exception) {
            // 이미 해제되었거나 문제 발생 시 무시
        }
        
        mediaController = controller
        mediaController?.registerCallback(controllerCallback)
        sendMediaData()
    }
    
    private fun bitmapToBase64(bitmap: Bitmap?): String? {
        if (bitmap == null) return null
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }

    private fun createMediaDataMap(): WritableMap? {
        val controller = mediaController
        val metadata = controller?.metadata
        val state = controller?.playbackState

        if (controller == null || metadata == null || state == null) {
            return null
        }

        val albumArtBitmap = metadata.getBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART)
        val albumArtBase64 = "data:image/png;base64," + bitmapToBase64(albumArtBitmap)

        return Arguments.createMap().apply {
            putString("title", metadata.getString(MediaMetadata.METADATA_KEY_TITLE))
            putString("artist", metadata.getString(MediaMetadata.METADATA_KEY_ARTIST))
            putString("album", metadata.getString(MediaMetadata.METADATA_KEY_ALBUM))
            putDouble("duration", metadata.getLong(MediaMetadata.METADATA_KEY_DURATION).toDouble())
            putBoolean("isPlaying", state.state == PlaybackState.STATE_PLAYING)
            putString("albumArt", albumArtBase64)
        }
    }

    private fun sendMediaData() {
        sendEvent("onMediaDataChanged", createMediaDataMap())
    }

    @ReactMethod
    fun getCurrentMediaState(promise: Promise) {
        try {
            promise.resolve(createMediaDataMap())
        } catch (e: Exception) {
            promise.reject("GET_MEDIA_STATE_ERROR", e.message)
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        if (context.hasActiveReactInstance()) {
            context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    @ReactMethod
    fun checkNotificationListenerPermission(promise: Promise) {
        try {
            val enabledListeners = NotificationManagerCompat.getEnabledListenerPackages(context)
            val packageName = context.packageName
            val isPermissionGranted = enabledListeners.contains(packageName)
            promise.resolve(isPermissionGranted)
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", e.message)
        }
    }

    @ReactMethod
    fun startObserver(promise: Promise) {
        try {
            val mediaSessionManager = context.getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
            val componentName = ComponentName(context, MediaNotificationListener::class.java)
            
            try {
                val activeSessions = mediaSessionManager.getActiveSessions(componentName)
                if (activeSessions.isNotEmpty()) {
                    updateMediaController(activeSessions[0])
                } else {
                    updateMediaController(null)
                }
                promise.resolve(true)
            } catch (e: SecurityException) {
                 promise.reject("PERMISSION_ERROR", "Notification Listener permission required.")
            }
        } catch (e: Exception) {
            promise.reject("OBSERVER_ERROR", e.message)
        }
    }
    
    @ReactMethod
    fun getCurrentPosition(promise: Promise) {
        val controller = mediaController
        val state = controller?.playbackState

        if (controller == null || state == null) {
            promise.reject("NO_MEDIA_SESSION", "No active media session found.")
            return
        }

        try {
            val currentPosition = state.position.toDouble()
            promise.resolve(currentPosition)
        } catch (e: Exception) {
            promise.reject("CURRENT_POSITION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun openNotificationListenerSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    // --- [추가된 기능] 알림 띄우기 (JS에서 호출) ---
    @ReactMethod
    fun showInsightNotification(title: String, content: String) {
        val channelId = "lymo_insight_channel"
        val notificationId = 101 // 고유 ID (같은 ID로 보내면 덮어쓰기됨)

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // 안드로이드 8.0 (Oreo) 이상에서는 채널 생성이 필수입니다.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Lymo Insights", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Music Insight Notifications"
                enableVibration(false) // 조용하게
                enableLights(false)
            }
            notificationManager.createNotificationChannel(channel)
        }

        // 알림 생성
        // 주의: setSmallIcon에는 실제 존재하는 아이콘 리소스 ID를 넣어야 합니다.
        // 기본적으로 안드로이드 아이콘을 쓰거나, R.drawable.ic_notification 등을 사용하세요.
        // 여기서는 임시로 시스템 아이콘을 사용합니다.
        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info) 
            .setContentTitle(title)
            .setContentText(content)
            .setPriority(NotificationCompat.PRIORITY_LOW) // 중요도 낮음 (소리 X, 팝업 X)
            .setAutoCancel(true) // 터치 시 삭제
            .build()

        notificationManager.notify(notificationId, notification)
    }

    @ReactMethod
    fun addListener(type: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(type: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}