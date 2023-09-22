package com.hmdevconsulting.vidoc.dataaccess

import org.apache.commons.text.StringEscapeUtils

class CommandStringBuilder {
    companion object {
        @JvmStatic
        fun buildCommandString(binaryPath: String, action: String, arguments: Map<String, String>): String {
            val argumentsString = arguments.entries.joinToString(" ") {
                "--${it.key} \"${StringEscapeUtils.escapeJava(it.value)}\"" }
                return "$binaryPath $action $argumentsString"
            }
        }
    }
