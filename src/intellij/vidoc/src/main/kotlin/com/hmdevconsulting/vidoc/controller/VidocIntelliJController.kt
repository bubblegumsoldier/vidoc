package com.hmdevconsulting.vidoc.controller

import com.hmdevconsulting.vidoc.dataaccess.VidocAccessor
import com.hmdevconsulting.vidoc.dataaccess.VidocAccessorFactory
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.VidocPluginState

class VidocIntelliJController(
    var state: VidocPluginState = VidocPluginState.IDLE,
    private var vidocAccessor: VidocAccessor = VidocAccessorFactory.getAccessor(),
    var projectBasePath: String? = null,
    var selectedAudioDevice: String? = null
) {
    suspend fun getConfig(): Config {
        val basePath = projectBasePath ?: throw NoWorkspaceOpened()
        return vidocAccessor.getConfig(basePath)
    }

    suspend fun getAudioDevices(): List<String> {
        val basePath = projectBasePath ?: throw NoWorkspaceOpened()
        return vidocAccessor.getAudioDevices(basePath)
    }

    fun startRecording() {

    }
}