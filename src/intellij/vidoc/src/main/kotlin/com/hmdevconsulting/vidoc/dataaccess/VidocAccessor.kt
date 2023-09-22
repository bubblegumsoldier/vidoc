package com.hmdevconsulting.vidoc.dataaccess

import com.hmdevconsulting.vidoc.model.Config
import com.hmdevconsulting.vidoc.model.PositionedVidocInstance
import com.hmdevconsulting.vidoc.model.Vidoc

interface VidocAccessor {
    suspend fun getConfig(projectBasePath: String): Config

    suspend fun parseFile(projectBasePath: String, filePath: String): List<PositionedVidocInstance>

    suspend fun record(projectBasePath: String, audioDevice: String): Vidoc

    suspend fun getAudioDevices(projectBasePath: String): List<String>

    suspend fun getVidocObject(projectBasePath: String, id: String): Vidoc

    suspend fun postProcessVidoc(projectBasePath: String, id: String): Vidoc

    suspend fun findUnusedFiles(projectBasePath: String): List<String>

    suspend fun removeUnusedFiles(projectBasePath: String): List<String>

    suspend fun getVidocs(projectBasePath: String): List<Vidoc>
}