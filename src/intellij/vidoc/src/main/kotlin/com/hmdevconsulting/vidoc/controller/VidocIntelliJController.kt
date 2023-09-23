package com.hmdevconsulting.vidoc.controller

import CursorPositionStringAppender
import com.hmdevconsulting.vidoc.dataaccess.CLIAsyncCommandExecutor
import com.hmdevconsulting.vidoc.dataaccess.VidocAccessor
import com.hmdevconsulting.vidoc.dataaccess.VidocAccessorFactory
import com.hmdevconsulting.vidoc.exceptions.NoAudioDeviceSelected
import com.hmdevconsulting.vidoc.exceptions.NoCursorPositionSelected
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.FocusInformation
import com.hmdevconsulting.vidoc.model.Vidoc
import com.hmdevconsulting.vidoc.model.VidocPluginState
import com.hmdevconsulting.vidoc.ui.EditorInfoUtil
import com.hmdevconsulting.vidoc.ui.RecordButtonAction
import com.hmdevconsulting.vidoc.ui.VidocNotifier
import com.intellij.openapi.actionSystem.ActionManager
import com.intellij.openapi.actionSystem.ActionToolbar
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.project.Project
import kotlinx.coroutines.*

@Service(Service.Level.PROJECT)
class VidocIntelliJController(
    private val project: Project
) {
    var state: VidocPluginState = VidocPluginState.IDLE
    private var vidocAccessor: VidocAccessor = VidocAccessorFactory.getAccessor()
    var selectedAudioDevice: String? = null
    private var processWrapper: CLIAsyncCommandExecutor.ProcessWrapper? = null
    private var lastRecordedVidocId: String? = null

    private val job = Job()
    private val scope = CoroutineScope(Dispatchers.Default + job) // Dispatchers.Default for CPU-intensive work


    fun getConfig(): Config {
        return vidocAccessor.getConfig(project.basePath?: throw NoWorkspaceOpened())
    }

    fun getAudioDevices(): List<String> {
        return vidocAccessor.getAudioDevices(project.basePath?: throw NoWorkspaceOpened())
    }

    fun startRecording(e: AnActionEvent) {
        val basePath = project.basePath?: throw NoWorkspaceOpened()
        val focusInformation = EditorInfoUtil.getFocusInformation(e) ?: throw NoCursorPositionSelected()
        val audioDevice = selectedAudioDevice ?: throw NoAudioDeviceSelected()

        val vidoc: Vidoc = vidocAccessor.prepareVidocObject(basePath, focusInformation)
        lastRecordedVidocId = vidoc.id

        val stringToAppend = vidocAccessor.getStringToAppend(basePath, vidoc.id)
        CursorPositionStringAppender.appendToCurrentCursorPosition(e, stringToAppend)

        try {
            processWrapper = vidocAccessor.record(
                basePath,
                vidoc.id,
                audioDevice
            )
            state = VidocPluginState.RECORDING
        } catch (e: Exception) {
            state = VidocPluginState.IDLE
            lastRecordedVidocId = null
        }

    }

    fun stopRecording(e: AnActionEvent) {
        if (state != VidocPluginState.RECORDING && state != VidocPluginState.WAITING_FOR_RECORDING_START) {
            throw Exception("Cannot cancel non-running recording")
        }
        try {
            processWrapper?.stop()
        } catch (e: Exception) {
            state = VidocPluginState.IDLE
            throw e
        }
        // state = VidocPluginState.POSTPROCESSING
        state = VidocPluginState.POSTPROCESSING // Needs to be removed still
        startPostprocessing(e)
    }

    fun startPostprocessing(e: AnActionEvent) {
        scope.launch {
            withContext(Dispatchers.IO) {
                // Execute your long-running task here
                vidocAccessor.postProcessVidoc(
                    project.basePath?: throw NoWorkspaceOpened(),
                    lastRecordedVidocId ?: throw Exception("No Vidoc ID found")
                )

                state = VidocPluginState.IDLE
                ApplicationManager.getApplication().invokeLater {
                    VidocNotifier.success(
                        "Successfully postprocessed vidoc",
                        "Your Vidoc has been postprocessed successfully and can now be watched",
                        project
                    )
                    e.actionManager.getAction("Vidoc.RecordButton").update(e)
                }
            }
        }

    }
}