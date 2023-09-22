package com.hmdevconsulting.vidoc.controller

import com.hmdevconsulting.vidoc.dataaccess.VidocAccessor
import com.hmdevconsulting.vidoc.dataaccess.VidocCLIAccessor

object ControllerFactory {
    private val instance: VidocIntelliJController = VidocIntelliJController()
    fun getController(): VidocIntelliJController = instance
}
