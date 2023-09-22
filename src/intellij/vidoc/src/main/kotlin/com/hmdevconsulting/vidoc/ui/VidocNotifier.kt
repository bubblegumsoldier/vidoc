package com.hmdevconsulting.vidoc.ui

import com.intellij.notification.Notification
import com.intellij.notification.NotificationType
import com.intellij.notification.Notifications
import com.intellij.openapi.project.Project

class VidocNotifier private constructor() { // private constructor to prevent instantiation

    companion object {
        private const val PLUGIN_ID = "com.hmdevconsulting.vidoc"

        @JvmStatic
        fun error(title: String, message: String, project: Project?) {
            notify(NotificationType.ERROR, title, message, project)
        }

        @JvmStatic
        fun warn(title: String, message: String, project: Project?) {
            notify(NotificationType.WARNING, title, message, project)
        }

        @JvmStatic
        fun info(title: String, message: String, project: Project?) {
            notify(NotificationType.INFORMATION, title, message, project)
        }

        @JvmStatic
        fun success(title: String, message: String, project: Project?) {
            notify(NotificationType.INFORMATION, title, message, project)
        }

        private fun notify(type: NotificationType, title: String, message: String, project: Project?) {
            val notification = Notification(PLUGIN_ID, title, message, type)
            Notifications.Bus.notify(notification, project)
        }
    }
}

