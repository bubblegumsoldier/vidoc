package com.hmdevconsulting.vidoc.dataaccess

import org.apache.commons.text.StringEscapeUtils

import java.util.Base64

class CommandStringBuilder {
    companion object {
        @JvmStatic
        fun buildCommandString(
            binaryPath: String,
            action: String,
            arguments: Map<String, String>,
            base64Keys: List<String>? = null
        ): String {
            val argumentsString = arguments.entries.joinToString(" ") { entry ->
                val key = entry.key
                val value = if (base64Keys?.contains(key) == true) {
                    Base64.getEncoder().encodeToString(entry.value.toByteArray(Charsets.UTF_8))
                } else {
                    StringEscapeUtils.escapeJava(entry.value) // or entry.value if no escape needed
                }
                "--$key \"$value\""
            }
            return "$binaryPath $action $argumentsString"
        }
    }
}
