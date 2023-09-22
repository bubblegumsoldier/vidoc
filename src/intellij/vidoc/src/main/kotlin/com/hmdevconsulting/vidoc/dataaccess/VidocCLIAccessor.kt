package com.hmdevconsulting.vidoc.dataaccess

import CliCommandExecutor
import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.PositionedVidocInstance
import com.hmdevconsulting.vidoc.model.Vidoc

class VidocCLIAccessor : VidocAccessor {
    private val cliCommandExecutor = CliCommandExecutor()

    override suspend fun getConfig(projectBasePath: String): Config = cliCommandExecutor.performCommand(projectBasePath, "getConfig")
    override suspend fun parseFile(projectBasePath: String, filePath: String): List<PositionedVidocInstance> {
        TODO("Not yet implemented")
    }

    override suspend fun record(projectBasePath: String, audioDevice: String): Vidoc {
        TODO("Not yet implemented")
    }

    override suspend fun getAudioDevices(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override suspend fun getVidocObject(projectBasePath: String, id: String): Vidoc {
        TODO("Not yet implemented")
    }

    override suspend fun postProcessVidoc(projectBasePath: String, id: String): Vidoc {
        TODO("Not yet implemented")
    }

    override suspend fun findUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override suspend fun removeUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override suspend fun getVidocs(projectBasePath: String): List<Vidoc> {
        TODO("Not yet implemented")
    }


}