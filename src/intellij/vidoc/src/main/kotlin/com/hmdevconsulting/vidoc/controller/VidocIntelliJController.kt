package com.hmdevconsulting.vidoc.controller

import com.hmdevconsulting.vidoc.dataaccess.CLIAsyncCommandExecutor
import com.hmdevconsulting.vidoc.dataaccess.VidocAccessor
import com.hmdevconsulting.vidoc.dataaccess.VidocAccessorFactory
import com.hmdevconsulting.vidoc.exceptions.NoAudioDeviceSelected
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.FocusInformation
import com.hmdevconsulting.vidoc.model.VidocPluginState

class VidocIntelliJController(
    var state: VidocPluginState = VidocPluginState.IDLE,
    private var vidocAccessor: VidocAccessor = VidocAccessorFactory.getAccessor(),
    var projectBasePath: String? = null,
    var selectedAudioDevice: String? = null
) {
    private var processWrapper: CLIAsyncCommandExecutor.ProcessWrapper? = null

    fun getConfig(): Config {
        val basePath = projectBasePath ?: throw NoWorkspaceOpened()
        return vidocAccessor.getConfig(basePath)
    }

    fun getAudioDevices(): List<String> {
        val basePath = projectBasePath ?: throw NoWorkspaceOpened()
        return vidocAccessor.getAudioDevices(basePath)
    }

    fun startRecording(focusInformation: FocusInformation) {
        val basePath = projectBasePath ?: throw NoWorkspaceOpened()
        val audioDevice = selectedAudioDevice ?: throw NoAudioDeviceSelected()

        try {
            processWrapper = vidocAccessor.record(
                basePath,
                audioDevice,
                focusInformation
            )
            state = VidocPluginState.RECORDING
        } catch (e: Exception) {
            state = VidocPluginState.IDLE
        }

    }

    fun stopRecording() {
        if(state != VidocPluginState.RECORDING && state != VidocPluginState.WAITING_FOR_RECORDING_START) {
            throw Exception("Cannot cancel non-running recording")
        }
        try {
            processWrapper?.stop()
        } catch(e: Exception) {
            state = VidocPluginState.IDLE
            throw e
        }
        state = VidocPluginState.POSTPROCESSING
        startPostprocessing()
    }

    fun startPostprocessing() {
        println("Starting postprocessing here")
    }
}