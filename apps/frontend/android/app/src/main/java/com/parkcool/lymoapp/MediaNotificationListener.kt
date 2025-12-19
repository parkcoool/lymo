package com.parkcool.lymoapp

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class MediaNotificationListener : NotificationListenerService(), MediaSessionManager.OnActiveSessionsChangedListener {

    private lateinit var mediaSessionManager: MediaSessionManager
    private var lastTrackTitle: String? = null
    
    private var activeController: MediaController? = null

    companion object {
        var mediaModule: MediaModule? = null
        fun setModule(module: MediaModule) {
            mediaModule = module
        }
    }

    override fun onCreate() {
        super.onCreate()
        mediaSessionManager = getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        
        val componentName = ComponentName(this, this.javaClass)
        try {
            mediaSessionManager.addOnActiveSessionsChangedListener(this, componentName)
            findActiveMediaSession()
        } catch (e: SecurityException) {
            Log.e("LymoListener", "Error connecting listener: ${e.message}")
        }
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        try {
            mediaSessionManager.removeOnActiveSessionsChangedListener(this)
            activeController?.unregisterCallback(mediaControllerCallback)
            activeController = null
        } catch (e: Exception) {
             Log.e("LymoListener", "Error removing listener: ${e.message}")
        }
    }

    override fun onActiveSessionsChanged(controllers: MutableList<MediaController>?) {
        findActiveMediaSession()
    }

    fun findActiveMediaSession() {
        val componentName = ComponentName(this, this.javaClass)
        try {
            val activeSessions = mediaSessionManager.getActiveSessions(componentName)
            
            if (activeSessions.isNotEmpty()) {
                val newController = activeSessions[0]
                
                // 기존과 같은 컨트롤러라면 패스 (패키지명으로 대략적 비교)
                if (activeController != null && 
                    newController.packageName == activeController?.packageName) {
                    return
                }

                Log.d("LymoListener", "Hooking into NEW controller: ${newController.packageName}")
                
                // 기존 콜백 제거 및 멤버 변수 업데이트
                activeController?.unregisterCallback(mediaControllerCallback)
                activeController = newController
                activeController?.registerCallback(mediaControllerCallback)

                // UI 모듈에도 전달 (있으면)
                mediaModule?.updateMediaController(newController)
            } else {
                Log.d("LymoListener", "No active media sessions found.")
            }
        } catch (e: Exception) {
            Log.e("LymoListener", "Error finding sessions: ${e.message}")
        }
    }

    // 콜백 객체를 멤버 변수로 선언하여 재사용 및 관리
    private val mediaControllerCallback = object : MediaController.Callback() {
        override fun onMetadataChanged(metadata: MediaMetadata?) {
            super.onMetadataChanged(metadata)
            metadata?.let {
                val title = it.getString(MediaMetadata.METADATA_KEY_TITLE) ?: ""
                val artist = it.getString(MediaMetadata.METADATA_KEY_ARTIST) ?: ""
                
                Log.d("LymoListener", "Metadata Changed: $title / $artist")

                if (lastTrackTitle == title) return 

                lastTrackTitle = title
                Log.d("LymoListener", "🎵 New Track Detected: $title by $artist")

                // Headless JS 실행
                val serviceIntent = Intent(applicationContext, MediaHeadlessTaskService::class.java)
                val bundle = Bundle().apply {
                    putString("title", title)
                    putString("artist", artist)
                }
                serviceIntent.putExtras(bundle)
                
                try {
                    startService(serviceIntent)
                    Log.d("LymoListener", "🚀 Headless Service Started")
                } catch (e: Exception) {
                    Log.e("LymoListener", "Failed to start Headless Service: ${e.message}")
                }
            }
        }
    }
}