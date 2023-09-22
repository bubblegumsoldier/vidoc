package com.hmdevconsulting.vidoc.dataaccess

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

class CLIAsyncCommandExecutor {
    private var process: Process? = null

    fun startCommand(command: String, cwd: String): ProcessWrapper {
        val processBuilder = ProcessBuilder(command.split("\\s".toRegex()))
        processBuilder.directory(File(cwd))
        processBuilder.redirectErrorStream(true)

        process = processBuilder.start()

        val reader = BufferedReader(InputStreamReader(process!!.inputStream))
        val output = StringBuilder()

        Thread {
            var line: String?
            while (true) {
                line = reader.readLine()
                if (line == null) break
                output.append(line).append("\n")
            }
        }.start()

        return ProcessWrapper(process!!)
    }

    inner class ProcessWrapper(private val process: Process) {
        fun stop() {
            process.destroy()
        }
    }
}
