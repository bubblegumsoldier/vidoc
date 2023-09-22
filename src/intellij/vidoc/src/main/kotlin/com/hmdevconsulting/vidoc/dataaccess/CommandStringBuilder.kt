package com.hmdevconsulting.vidoc.dataaccess

class CommandStringBuilder {
    companion object {
        @JvmStatic
        fun buildCommandString(binaryPath: String, action: String, arguments: Map<String, String>): String {
            val argumentsString = arguments.entries.joinToString(" ") { "--${it.key}=${it.value}" }
            return "$binaryPath $action $argumentsString"
        }
    }
}
