package com.parkcool.lymoapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
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
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.parkcool.lymoapp.R
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

    @ReactMethod
    fun checkNotificationPermission(promise: Promise) {
        try {
            val notificationManager = NotificationManagerCompat.from(context)
            val areNotificationsEnabled = notificationManager.areNotificationsEnabled()
            promise.resolve(areNotificationsEnabled)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_PERMISSION_CHECK_ERROR", e.message)
        }
    }

    @ReactMethod
    fun requestNotificationPermission() {
        val intent = Intent()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent.action = Settings.ACTION_APP_NOTIFICATION_SETTINGS
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
        } else {
            intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
            intent.data = Uri.parse("package:" + context.packageName)
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }

    @ReactMethod
    fun showInsightNotification(title: String, content: String) {
        val channelId = "lymo_insight_channel"
        val notificationId = 101 // 고유 ID (같은 ID로 보내면 덮어쓰기됨)

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Lymo Insights", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Music Insight Notifications"
                enableVibration(false)
                enableLights(false)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val deepLinkUrl = "lymoapp://player?source=notification"
        
        // 1) 이 주소를 여는 Intent 생성
        val intent = Intent(context, MainActivity::class.java)
        
        intent.action = Intent.ACTION_VIEW
        intent.data = Uri.parse(deepLinkUrl)
        intent.flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP

        // 2) PendingIntent로 감싸기
        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE 
        )

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_stat_logo)
            .setContentTitle(title)
            .setContentText(content)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
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