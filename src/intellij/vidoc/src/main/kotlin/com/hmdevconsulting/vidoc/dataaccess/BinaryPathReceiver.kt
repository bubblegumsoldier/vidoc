package com.hmdevconsulting.vidoc.dataaccess

import java.io.File
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardCopyOption
import org.apache.commons.lang3.SystemUtils

class BinaryPathReceiver {
    companion object {

        private val binariesMap = mapOf(
            "windows" to listOf("vidoc-win.exe", "ffmpeg-win32.exe", "win-info-win32.exe"),
            "macos" to listOf("vidoc-macos", "ffmpeg-darwin", "win-info-darwin"),
            "linux" to listOf("vidoc-linux")
        )

        @JvmStatic
        fun getBinaryPath(): String {
            val (osKey, mainBinary) = when {
                SystemUtils.IS_OS_WINDOWS -> "windows" to "vidoc-win.exe"
                SystemUtils.IS_OS_MAC -> "macos" to "vidoc-macos"
                SystemUtils.IS_OS_LINUX -> "linux" to "vidoc-linux"
                else -> throw UnsupportedOperationException("Unsupported operating system")
            }

            val tmpDir = System.getProperty("java.io.tmpdir")
            val binaryDir = File("$tmpDir${File.separator}vidoc-binaries")
            binaryDir.mkdirs()

            binariesMap[osKey]?.forEach { binaryName ->
                val binaryPath = "$binaryDir${File.separator}$binaryName"
                val binaryFile = File(binaryPath)

                if (!binaryFile.exists()) {
                    val resourcePath = "/bin/$binaryName"
                    javaClass.getResourceAsStream(resourcePath)?.use { inputStream ->
                        Files.copy(inputStream, Path.of(binaryPath), StandardCopyOption.REPLACE_EXISTING)
                    } ?: throw Exception("Failed to load binary resource: $resourcePath")
                }

                if (binaryName == mainBinary && !binaryFile.setExecutable(true)) {
                    throw Exception("Failed to set executable permission: $binaryPath")
                }
            }

            return "$binaryDir${File.separator}$mainBinary"
        }
    }
}
