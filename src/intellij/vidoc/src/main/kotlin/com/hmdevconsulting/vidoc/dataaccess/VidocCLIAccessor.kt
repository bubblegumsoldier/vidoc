package com.hmdevconsulting.vidoc.dataaccess

import CliCommandExecutor
import com.google.gson.Gson
import com.hmdevconsulting.vidoc.model.*

class VidocCLIAccessor : VidocAccessor {
    private val cliCommandExecutor = CliCommandExecutor()

    override fun getConfig(projectBasePath: String): Config =
        cliCommandExecutor.performCommand(projectBasePath, "getConfig")

    override fun parseFile(projectBasePath: String, filePath: String): List<PositionedVidocInstance> {
        TODO("Not yet implemented")
    }

    override fun prepareVidocObject(projectBasePath: String, focusInformation: FocusInformation): Vidoc {
        val focusInformationJsonString: String = Gson().toJson(focusInformation)
        return cliCommandExecutor.performCommand(
            projectBasePath, "prepareVidoc", mapOf(
                "focusInformation" to focusInformationJsonString
            ), listOf("focusInformation")
        )
    }


    override fun getStringToAppend(projectBasePath: String, vidocId: String): String =
        cliCommandExecutor.performCommand(
            projectBasePath, "getStringToAppend", mapOf(
                "vidocId" to vidocId
            )
        )

    override fun record(
        projectBasePath: String,
        vidocId: String,
        audioDevice: String
    ): CLIAsyncCommandExecutor.ProcessWrapper {
        val commandString = CommandStringBuilder.buildCommandString(
            BinaryPathReceiver.getBinaryPath(), "record", mapOf(
                "audioDevice" to audioDevice,
                "vidocId" to vidocId
            )
        );
        return CLIAsyncCommandExecutor().startCommand(commandString, projectBasePath)
    }

    override fun getAudioDevices(projectBasePath: String): List<String> =
        cliCommandExecutor.performCommand(projectBasePath, "getAudioDevices")

    override fun getVidocObject(projectBasePath: String, id: String): Vidoc = cliCommandExecutor.performCommand(
        projectBasePath, "getVidocObject", mapOf(
            "id" to id
        )
    )

    override fun postProcessVidoc(projectBasePath: String, id: String): Vidoc = cliCommandExecutor.performCommand(
        projectBasePath, "postProcessVidoc", mapOf(
            "vidocId" to id
        )
    )

    override fun findUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override fun removeUnusedFiles(projectBasePath: String): List<String> {
        TODO("Not yet implemented")
    }

    override fun getVidocs(projectBasePath: String): List<Vidoc> {
        TODO("Not yet implemented")
    }

    override fun getVidocHTMLPage(projectBasePath: String, vidocId: String): HTMLPageOutput =
        cliCommandExecutor.performCommand(
            projectBasePath, "writeVidocHTML", mapOf(
                "vidocId" to vidocId
            )
        )

}