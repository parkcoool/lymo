package expo.modules.medianotificationlistener

import android.service.notification.NotificationListenerService

class MediaNotificationListenerService : NotificationListenerService() {
  // This service is required to access media sessions
  // The service doesn't need to do anything, it just needs to exist
  // so that the MediaSessionManager can use it as a ComponentName
}
