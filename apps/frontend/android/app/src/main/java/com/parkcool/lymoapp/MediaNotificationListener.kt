package com.parkcool.lymoapp

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.service.notification.NotificationListenerService
import android.util.Log

class MediaNotificationListener : NotificationListenerService(), MediaSessionManager.OnActiveSessionsChangedListener {

    private lateinit var mediaSessionManager: MediaSessionManager
    private var lastTrackTitle: String? = null
    
    // GC 방지용 컨트롤러 참조
    private var activeController: MediaController? = null

    // Debounce를 위한 핸들러
    private val handler = Handler(Looper.getMainLooper())
    
    // 예약된 작업 및 데이터
    private var pendingRunnable: Runnable? = null
    private var pendingTitle: String = ""
    private var pendingArtist: String = ""
    private var pendingDuration: Double = 0.0

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
            Log.e("LymoListener", "SecurityException: ${e.message}")
        }
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        // 서비스 종료 시 예약된 작업 취소
        if (pendingRunnable != null) handler.removeCallbacks(pendingRunnable!!)
        
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
                
                // 이미 연결된 컨트롤러라면 패스
                if (activeController != null && 
                    newController.packageName == activeController?.packageName) {
                    return
                }

                // 기존 콜백 제거 및 새 컨트롤러 등록
                activeController?.unregisterCallback(mediaControllerCallback)
                activeController = newController
                activeController?.registerCallback(mediaControllerCallback)
                
                // UI 모듈 갱신
                mediaModule?.updateMediaController(newController)
            }
        } catch (e: Exception) {
            Log.e("LymoListener", "Error finding sessions: ${e.message}")
        }
    }

    private val mediaControllerCallback = object : MediaController.Callback() {
        override fun onMetadataChanged(metadata: MediaMetadata?) {
            super.onMetadataChanged(metadata)
            metadata?.let {
                val title = it.getString(MediaMetadata.METADATA_KEY_TITLE) ?: ""
                val artist = it.getString(MediaMetadata.METADATA_KEY_ARTIST) ?: ""
                val durationLong = it.getLong(MediaMetadata.METADATA_KEY_DURATION)
                val duration = durationLong.toDouble()

                if (lastTrackTitle == title) return 

                lastTrackTitle = title
                
                // 1) 기존 예약된 작업 취소 (곡 스킵)
                if (pendingRunnable != null) {
                    handler.removeCallbacks(pendingRunnable!!)
                }

                // 2) 데이터 업데이트
                pendingTitle = title
                pendingArtist = artist
                pendingDuration = duration

                // 3) 새로운 작업 예약
                pendingRunnable = Runnable {
                    triggerHeadlessJs(pendingTitle, pendingArtist, pendingDuration)
                }
                
                // 알림을 띄우기까지의 대기 시간 (ms 단위)
                handler.postDelayed(pendingRunnable!!, 5000) 
            }
        }
    }

    private fun triggerHeadlessJs(title: String, artist: String, duration: Double) {
        val serviceIntent = Intent(applicationContext, MediaHeadlessTaskService::class.java)
        val bundle = Bundle().apply {
            putString("title", title)
            putString("artist", artist)
            putDouble("duration", duration) 
        }
        serviceIntent.putExtras(bundle)
        
        try {
            startService(serviceIntent)
        } catch (e: Exception) {
            Log.e("LymoListener", "Failed to start Headless Service: ${e.message}")
        }
    }
}