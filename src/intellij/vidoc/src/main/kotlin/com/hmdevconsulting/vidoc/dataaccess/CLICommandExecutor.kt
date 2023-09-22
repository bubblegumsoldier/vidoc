import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.hmdevconsulting.vidoc.dataaccess.BinaryPathReceiver
import com.hmdevconsulting.vidoc.dataaccess.CommandStringBuilder
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

class CliCommandExecutor {
    @Throws(Exception::class)
    inline fun <reified T> performCommand(projectBasePath: String, action: String, arguments: Map<String, String> = emptyMap()): T {
        val command = CommandStringBuilder.buildCommandString(BinaryPathReceiver.getBinaryPath(), action, arguments)

        val processBuilder = ProcessBuilder()
        val process = processBuilder
            .command(command.split(" "))
            .directory(File(projectBasePath)) // Set the working directory here
            .start()

        val reader = BufferedReader(InputStreamReader(process.inputStream))
        val errorReader = BufferedReader(InputStreamReader(process.errorStream))

        val output = reader.readText()
        val errorOutput = errorReader.readText()

        val exitCode = process.waitFor()

        if (exitCode != 0 || errorOutput.isNotEmpty()) {
            throw Exception("Command execution failed with exit code $exitCode and error: $errorOutput")
        }

        return try {
            Gson().fromJson(output, T::class.java)
        } catch (e: JsonSyntaxException) {
            throw Exception("Failed to parse output to ${T::class.java.simpleName}: $output", e)
        }
    }
}
