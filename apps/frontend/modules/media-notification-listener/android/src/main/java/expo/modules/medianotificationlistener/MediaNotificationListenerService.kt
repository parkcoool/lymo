package expo.modules.medianotificationlistener

import android.service.notification.NotificationListenerService
import android.util.Log

class MediaNotificationListenerService : NotificationListenerService() {
  
  companion object {
    private const val TAG = "MediaNotiListener"
  }
  
  override fun onListenerConnected() {
    super.onListenerConnected()
    Log.d(TAG, "NotificationListenerService connected")
  }
  
  override fun onListenerDisconnected() {
    super.onListenerDisconnected()
    Log.d(TAG, "NotificationListenerService disconnected")
  }
}
