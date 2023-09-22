package com.hmdevconsulting.vidoc.ui

import com.hmdevconsulting.vidoc.controller.ControllerFactory
import com.hmdevconsulting.vidoc.exceptions.NoCursorPositionSelected
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

    override fun update(e: AnActionEvent) {
        if (e.project?.basePath == null) {
            return;
        }
        val controller = ControllerFactory.getController()
        controller.projectBasePath = e.project?.basePath;
        val presentation: Presentation = e.presentation
        when (ControllerFactory.getController().state) {
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
        ControllerFactory.getController().state = VidocPluginState.WAITING_FOR_AUDIO_DEVICE_SELECT
        val controller = ControllerFactory.getController()
        controller.projectBasePath = e.project?.basePath
        val audioDevices = controller.getAudioDevices()
        val popup = JBPopupFactory.getInstance().createPopupChooserBuilder(audioDevices)
            .setVisibleRowCount(7)
            .setSelectionMode(SINGLE_SELECTION)
            .setItemChosenCallback {
                controller.selectedAudioDevice = it
                controller.state = VidocPluginState.WAITING_FOR_RECORDING_START
                controller.startRecording(
                    focusPosition
                )
            }
            .setCancelCallback {
                abortDeviceSelection()
                true
            }
            .createPopup()
        val button = e.inputEvent.component

        // Show the popup relative to the button
        popup.showUnderneathOf(button)
    }

    private fun abortDeviceSelection() {
        ControllerFactory.getController().state = VidocPluginState.IDLE
    }

    override fun actionPerformed(e: AnActionEvent) {
        when (ControllerFactory.getController().state) {
            VidocPluginState.IDLE -> {
                requestAudioSelection(e)
                return;
            }

            VidocPluginState.WAITING_FOR_AUDIO_DEVICE_SELECT -> {
                abortDeviceSelection()
                return;
            }

            VidocPluginState.WAITING_FOR_RECORDING_START -> {
                ControllerFactory.getController().stopRecording()
                return;
            }

            VidocPluginState.RECORDING -> {
                ControllerFactory.getController().stopRecording()
                return;
            }

            VidocPluginState.POSTPROCESSING -> {
                // Cannot cancel postprocessing for now
                return
            }
        }
    }
}
