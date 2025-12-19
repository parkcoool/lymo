package com.parkcool.lymoapp

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MediaHeadlessTaskService : HeadlessJsTaskService() {

    // intent 파라미터에 '?'를 붙여 Nullable로 변경
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        // intent가 null일 수 있으므로 안전하게 처리
        val extras = intent?.extras
        if (extras != null) {
            return HeadlessJsTaskConfig(
                "LymoMediaTask", // JS에 등록된 Task 이름
                Arguments.fromBundle(extras),
                5000, // 타임아웃
                true // 포그라운드 허용
            )
        }
        return null
    }
}