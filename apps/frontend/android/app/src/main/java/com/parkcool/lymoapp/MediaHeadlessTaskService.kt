package com.parkcool.lymoapp

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MediaHeadlessTaskService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val extras = intent?.extras
        if (extras != null) {
            return HeadlessJsTaskConfig(
                "LymoMediaTask", // JS에 등록된 Task 이름
                Arguments.fromBundle(extras),
                10000, // 타임아웃
                true // 포그라운드 허용
            )
        }
        return null
    }
}