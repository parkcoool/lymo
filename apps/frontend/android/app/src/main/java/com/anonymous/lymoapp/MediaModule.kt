package com.anonymous.lymoapp

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.graphics.Bitmap
import java.io.ByteArrayOutputStream
import android.util.Base64
import androidx.core.app.NotificationManagerCompat

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
        mediaController?.unregisterCallback(controllerCallback)
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
            putString("coverUrl", albumArtBase64)
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
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
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
            val activeSessions = mediaSessionManager.getActiveSessions(componentName)

            if (activeSessions.isNotEmpty()) {
                updateMediaController(activeSessions[0])
            } else {
                updateMediaController(null)
            }
            promise.resolve(true)
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
    fun addListener(type: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(type: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}

