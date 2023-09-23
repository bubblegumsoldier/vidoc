package com.hmdevconsulting.vidoc.dataaccess

import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.FocusInformation
import com.hmdevconsulting.vidoc.model.PositionedVidocInstance
import com.hmdevconsulting.vidoc.model.Vidoc

interface VidocAccessor {
    fun getConfig(projectBasePath: String): Config

    fun parseFile(projectBasePath: String, filePath: String): List<PositionedVidocInstance>

    fun record(projectBasePath: String, vidocId: String, audioDevice: String): CLIAsyncCommandExecutor.ProcessWrapper

    fun getAudioDevices(projectBasePath: String): List<String>

    fun getVidocObject(projectBasePath: String, id: String): Vidoc

    fun prepareVidocObject(projectBasePath: String, focusInformation: FocusInformation): Vidoc
    fun getStringToAppend(projectBasePath: String, vidocId: String): String

    fun postProcessVidoc(projectBasePath: String, id: String): Vidoc

    fun findUnusedFiles(projectBasePath: String): List<String>

    fun removeUnusedFiles(projectBasePath: String): List<String>

    fun getVidocs(projectBasePath: String): List<Vidoc>
}