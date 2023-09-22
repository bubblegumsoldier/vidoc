package com.hmdevconsulting.vidoc.ui

import com.hmdevconsulting.vidoc.controller.ControllerFactory
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.VidocPluginState
import com.hmdevconsulting.vidoc.ui.icons.VidocIcons
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.Presentation
import com.intellij.openapi.ui.Messages
import javax.swing.Icon
import com.intellij.ui.AnimatedIcon
import kotlinx.coroutines.*
import com.intellij.openapi.ui.popup.JBPopupFactory
import javax.swing.ListSelectionModel.SINGLE_SELECTION

class RecordButtonAction : AnAction() {
    private val job = Job()
    private val scope = CoroutineScope(Dispatchers.Default + job)

    override fun update(e: AnActionEvent) {
        if (e.project?.basePath == null) {
            return;
        }
        val controller = ControllerFactory.getController()
        controller.projectBasePath = e.project?.basePath;
        val presentation: Presentation = e.presentation
        val icon: Icon = if (controller.state == VidocPluginState.IDLE) {
            VidocIcons.RecordIcon
        } else if (controller.state == VidocPluginState.RECORDING) {
            VidocIcons.StopIcon
        } else {
            AnimatedIcon.Default()
        }
        presentation.icon = icon
        presentation.text = if (controller.state == VidocPluginState.IDLE) {
            "Record Vidoc"
        } else if (controller.state == VidocPluginState.RECORDING) {
            "Recording Vidoc..."
        } else {
            "Postprocessing Vidoc..."
        }
    }

    override fun actionPerformed(e: AnActionEvent) {
        ControllerFactory.getController().state = VidocPluginState.WAITING_FOR_AUDIO_DEVICE_SELECT
        scope.launch {
            val controller = ControllerFactory.getController()
            controller.projectBasePath = e.project?.basePath
            val audioDevices = controller.getAudioDevices()
            withContext(Dispatchers.Main) {
                val popup = JBPopupFactory.getInstance().createPopupChooserBuilder(audioDevices)
                    .setVisibleRowCount(7)
                    .setSelectionMode(SINGLE_SELECTION)
                    .setItemChosenCallback {
                        controller.selectedAudioDevice = it
                        controller.state = VidocPluginState.WAITING_FOR_RECORDING_START
                        controller.startRecording()
                    }
                    .setCancelCallback {
                        controller.state = VidocPluginState.IDLE
                        true
                    }
                    .createPopup()
                val button = e.inputEvent.component

                // Show the popup relative to the button
                popup.showUnderneathOf(button)
            }
        }
        /*scope.launch {
            val controller = ControllerFactory.getAccessor()
            controller.projectBasePath = e.project?.basePath
            val config = controller.getConfig()
            withContext(Dispatchers.Main) {
                Messages.showMessageDialog(e.project, config.toString(), "Config Information", Messages.getInformationIcon())
            }
        }*/
    }

    fun dispose() {
        job.cancel() // call this when the class instance is no longer needed
    }
}
