package com.hmdevconsulting.vidoc.ui

import com.hmdevconsulting.vidoc.controller.VidocIntelliJController
import com.hmdevconsulting.vidoc.exceptions.NoCursorPositionSelected
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.VidocPluginState
import com.hmdevconsulting.vidoc.ui.icons.VidocIcons
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.Presentation
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import javax.swing.Icon
import com.intellij.ui.AnimatedIcon
import kotlinx.coroutines.*
import com.intellij.openapi.ui.popup.JBPopupFactory
import javax.swing.ListSelectionModel.SINGLE_SELECTION

class RecordButtonAction : AnAction() {

    override fun update(e: AnActionEvent) {
        var controller = e.project?.service<VidocIntelliJController>() ?: return
        val presentation: Presentation = e.presentation
        when (controller.state) {
            VidocPluginState.IDLE -> {
                presentation.text = "Record Vidoc"
                presentation.icon = VidocIcons.RecordIcon
            }

            VidocPluginState.WAITING_FOR_AUDIO_DEVICE_SELECT -> {
                presentation.text = "Select Audio Device"
                presentation.icon = VidocIcons.RecordIcon
            }

            VidocPluginState.WAITING_FOR_RECORDING_START -> {
                presentation.text = "Starting Recording..."
                AnimatedIcon.Default()
            }

            VidocPluginState.RECORDING -> {
                presentation.text = "Recording..."
                presentation.icon = VidocIcons.StopIcon
            }

            VidocPluginState.POSTPROCESSING -> {
                presentation.text = "Postprocessing..."
                presentation.icon = AnimatedIcon.Default()
            }
        }
    }

    private fun requestAudioSelection(e: AnActionEvent) {
        val focusPosition = EditorInfoUtil.getFocusInformation(e)
        if (focusPosition == null) {
            VidocNotifier.error(
                "No cursor position selected",
                "Please open a file and put your cursor in some line so we can annotate the file with the created Vidoc",
                e.project
            )
            throw NoCursorPositionSelected()
        }
        var controller = e.project?.service<VidocIntelliJController>()
        controller?: throw Exception("Controller not found")
        val audioDevices = controller.getAudioDevices()
        val popup = JBPopupFactory.getInstance().createPopupChooserBuilder(audioDevices)
            .setVisibleRowCount(7)
            .setSelectionMode(SINGLE_SELECTION)
            .setItemChosenCallback {
                controller.selectedAudioDevice = it
                controller.state = VidocPluginState.WAITING_FOR_RECORDING_START
                controller.startRecording(
                    e
                )
            }
            .setCancelCallback {
                abortDeviceSelection(e)
                true
            }
            .createPopup()
        val button = e.inputEvent?.component

        // Show the popup relative to the button
        popup.showUnderneathOf(button?: throw Exception("button not found"))
    }

    private fun abortDeviceSelection(e: AnActionEvent) {
        var controller = e.project?.service<VidocIntelliJController>()
        controller?: throw Exception("Controller not found")
        controller.state = VidocPluginState.IDLE
    }

    override fun actionPerformed(e: AnActionEvent) {
        var controller = e.project?.service<VidocIntelliJController>()
        controller?: throw Exception("Controller not found")
        when (controller.state) {
            VidocPluginState.IDLE -> {
                requestAudioSelection(e)
                return;
            }

            VidocPluginState.WAITING_FOR_AUDIO_DEVICE_SELECT -> {
                abortDeviceSelection(e)
                return;
            }

            VidocPluginState.WAITING_FOR_RECORDING_START -> {
                controller.stopRecording(e)
                return;
            }

            VidocPluginState.RECORDING -> {
                controller.stopRecording(e)
                return;
            }

            VidocPluginState.POSTPROCESSING -> {
                // Cannot cancel postprocessing for now
                return
            }
        }
    }
}
