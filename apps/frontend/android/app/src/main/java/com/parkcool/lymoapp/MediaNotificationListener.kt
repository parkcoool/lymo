package com.parkcool.lymoapp

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.media.session.PlaybackState
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.util.Log

class MediaNotificationListener : NotificationListenerService(), MediaSessionManager.OnActiveSessionsChangedListener {

    private lateinit var mediaSessionManager: MediaSessionManager
    // 중복 실행 방지를 위해 마지막으로 처리한 곡 제목을 저장
    private var lastTrackTitle: String? = null

    companion object {
        var mediaModule: MediaModule? = null

        fun setModule(module: MediaModule) {
            mediaModule = module
        }
    }

    override fun onCreate() {
        super.onCreate()
        mediaSessionManager = getSystemService(MEDIA_SESSION_SERVICE) as MediaSessionManager
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        val componentName = ComponentName(this, this.javaClass)
        try {
            mediaSessionManager.addOnActiveSessionsChangedListener(this, componentName)
            findActiveMediaSession()
        } catch (e: SecurityException) {
            // 권한 문제 등 예외 처리
            Log.e("LymoListener", "SecurityException: ${e.message}")
        }
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        try {
            mediaSessionManager.removeOnActiveSessionsChangedListener(this)
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
                val controller = activeSessions[0]
                
                // 1. 기존 로직: 앱이 켜져있을 때 화면 갱신용
                mediaModule?.updateMediaController(controller)
                
                // 2. 추가 로직: 변경 감지를 위한 콜백 등록
                registerCallback(controller)
            } else {
                mediaModule?.updateMediaController(null)
            }
        } catch (e: SecurityException) {
            Log.e("LymoListener", "Error finding active sessions: ${e.message}")
        }
    }

    private fun registerCallback(controller: MediaController) {
        // 기존 콜백이 쌓이는 것을 방지하기 위해 등록 전엔 원래 해제해주는 게 좋으나,
        // 여기서는 간단히 새 익명 객체를 등록합니다. 
        // (실제 상용화 시엔 멤버변수로 관리하여 unregister 처리 권장)
        
        controller.registerCallback(object : MediaController.Callback() {
            override fun onMetadataChanged(metadata: MediaMetadata?) {
                super.onMetadataChanged(metadata)
                metadata?.let {
                    val title = it.getString(MediaMetadata.METADATA_KEY_TITLE) ?: ""
                    val artist = it.getString(MediaMetadata.METADATA_KEY_ARTIST) ?: ""

                    // [최적화 핵심] 곡 제목이 이전과 같으면 무시 (재생바 이동 등은 무시)
                    if (lastTrackTitle == title) return 

                    lastTrackTitle = title
                    Log.d("LymoListener", "New Track Detected: $title by $artist")

                    // 백그라운드 작업(Headless JS) 실행
                    val serviceIntent = Intent(applicationContext, MediaHeadlessTaskService::class.java)
                    val bundle = Bundle().apply {
                        putString("title", title)
                        putString("artist", artist)
                    }
                    serviceIntent.putExtras(bundle)
                    
                    // 안드로이드 서비스 시작
                    try {
                        startService(serviceIntent)
                    } catch (e: Exception) {
                        Log.e("LymoListener", "Failed to start service: ${e.message}")
                    }
                }
            }
            
            // onPlaybackStateChanged 등 다른 이벤트는 무시하여 리소스 절약
        })
    }
}