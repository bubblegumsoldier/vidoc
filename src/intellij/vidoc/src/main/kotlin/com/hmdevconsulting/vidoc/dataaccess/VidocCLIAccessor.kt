package com.hmdevconsulting.vidoc.dataaccess

import CliCommandExecutor
import com.google.gson.Gson
import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.FocusInformation
import com.hmdevconsulting.vidoc.model.PositionedVidocInstance
import com.hmdevconsulting.vidoc.model.Vidoc

class VidocCLIAccessor : VidocAccessor {
    private val cliCommandExecutor = CliCommandExecutor()

    override fun getConfig(projectBasePath: String): Config =
        cliCommandExecutor.performCommand(projectBasePath, "getConfig")

    override fun parseFile(projectBasePath: String, filePath: String): List<PositionedVidocInstance> {
        TODO("Not yet implemented")
    }

    override fun record(
        projectBasePath: String,
        audioDevice: String,
        focusInformation: FocusInformation
    ): CLIAsyncCommandExecutor.ProcessWrapper {
        val focusInformationJsonString: String = Gson().toJson(focusInformation)
        val commandString = CommandStringBuilder.buildCommandString(
            BinaryPathReceiver.getBinaryPath(), "record", mapOf(
                "focusInformation" to focusInformationJsonString,
                "audioDevice" to audioDevice
            )
        );
        return CLIAsyncCommandExecutor().startCommand(commandString, projectBasePath)
    }

    override fun getAudioDevices(projectBasePath: String): List<String> =
        cliCommandExecutor.performCommand(projectBasePath, "getAudioDevices")

    override fun getVidocObject(projectBasePath: String, id: String): Vidoc {
        TODO("Not yet implemented")
    }

    override fun postProcessVidoc(projectBasePath: String, id: String): Vidoc {
        TODO("Not yet implemented")
    }

    override fun findUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override fun removeUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override fun getVidocs(projectBasePath: String): List<Vidoc> {
        TODO("Not yet implemented")
    }


}