package com.parkcool.lymoapp

import android.content.ComponentName
import android.media.session.MediaController
import android.media.session.MediaSessionManager
import android.service.notification.NotificationListenerService

class MediaNotificationListener : NotificationListenerService(), MediaSessionManager.OnActiveSessionsChangedListener {

    private lateinit var mediaSessionManager: MediaSessionManager

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
        mediaSessionManager.addOnActiveSessionsChangedListener(this, componentName)
        findActiveMediaSession()
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        mediaSessionManager.removeOnActiveSessionsChangedListener(this)
    }

    override fun onActiveSessionsChanged(controllers: MutableList<MediaController>?) {
        findActiveMediaSession()
    }

    fun findActiveMediaSession() {
        val componentName = ComponentName(this, this.javaClass)
        val activeSessions = mediaSessionManager.getActiveSessions(componentName)

        if (activeSessions.isNotEmpty()) {
            mediaModule?.updateMediaController(activeSessions[0])
        } else {
            mediaModule?.updateMediaController(null)
        }
    }
}