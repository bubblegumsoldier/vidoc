package com.hmdevconsulting.vidoc.model

class VidocPluginState {
    companion object {
        const val IDLE = "IDLE"
        const val RECORDING = "RECORDING"
        const val WAITING_FOR_RECORDING_START = "WAITING_FOR_RECORDING_START"
        const val WAITING_FOR_AUDIO_DEVICE_SELECT = "WAITING_FOR_AUDIO_DEVICE_SELECT"
        const val POSTPROCESSING = "POSTPROCESSING"
    }
}
