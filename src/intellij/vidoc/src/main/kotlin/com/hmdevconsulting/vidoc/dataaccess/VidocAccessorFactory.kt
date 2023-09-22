package com.hmdevconsulting.vidoc.dataaccess

object VidocAccessorFactory {
    private val instance: VidocAccessor = VidocCLIAccessor()
    fun getAccessor(): VidocAccessor = instance
}
