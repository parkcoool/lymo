package com.parkcool.lymoapp

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MediaHeadlessTaskService : HeadlessJsTaskService() {
  
  override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
    val extras = intent?.extras ?: return null
    
    return HeadlessJsTaskConfig(
      "MediaInsightTask",
      Arguments.fromBundle(extras),
      5000, // timeout
      true // allow in foreground
    )
  }
}
