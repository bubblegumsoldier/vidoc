package com.hmdevconsulting.vidoc.dataaccess

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.hmdevconsulting.vidoc.exceptions.NoVidocResultException
import com.hmdevconsulting.vidoc.model.Vidoc
import java.io.BufferedReader
import java.io.File
import java.io.IOException
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
        val processWrapper = ProcessWrapper(process!!, "")

        val thread = Thread {
            var line: String?
            var jsonHasStarted = false
            while (true) {
                line = reader.readLine()
                if (line == null) {
                    println("Line is null, breaking")
                    break
                }
                if (!line.startsWith("{") && !line.startsWith("[") && !jsonHasStarted) {
                    println("Received non-json line")
                    continue
                }
                jsonHasStarted = true
                output.append(line).append("\n")
                processWrapper.output = output.toString()
                println("[RECORDING] $line")
            }
        }
        thread.start()
        processWrapper.readerThread = thread

        println("[RECORDING] Starting recording")

        return processWrapper
    }

    inner class ProcessWrapper(
        private val process: Process,
        public var output: String?,
        public var readerThread: Thread? = null
    ) {
        fun sendInterrupt() {
            val os = System.getProperty("os.name").lowercase()
            when {
                os.contains("win") -> {
                    // On Windows, write a message to the process's stdin
                    try {
                        val outputStream = process.outputStream
                        val writer = outputStream.bufferedWriter()
                        writer.write("exit\n")
                        writer.flush()
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }
                }

                os.contains("mac") || os.contains("nix") || os.contains("nux") || os.contains("aix") -> {
                    // On Unix-based systems, send a SIGINT
                    val pid = getPid()
                    if (pid != null) {
                        try {
                            Runtime.getRuntime().exec("kill -INT $pid")
                        } catch (e: IOException) {
                            e.printStackTrace()
                        }
                    }
                }

                else -> println("Unsupported operating system")
            }
        }

        private fun getPid(): Long? {
            return try {
                return process.pid()
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }

        fun waitFor(): Int = process.waitFor()

        fun stop(): Vidoc {
            sendInterrupt()
            val exitCode = waitFor()
            if (output == null) {
                process.destroy()
                println("Process exited with code $exitCode")
                readerThread?.interrupt()
                throw NoVidocResultException()
            }
            process.destroy()
            readerThread?.interrupt()
            return try {
                Gson().fromJson(output, Vidoc::class.java)
            } catch (e: JsonSyntaxException) {
                throw Exception("Failed to parse output to ${Vidoc::class.java.simpleName}: $output", e)
            }
        }
    }
}
