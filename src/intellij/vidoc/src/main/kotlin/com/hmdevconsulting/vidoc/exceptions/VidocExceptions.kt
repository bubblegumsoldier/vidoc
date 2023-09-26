package com.hmdevconsulting.vidoc.exceptions

class NoWorkspaceOpened(message: String = "No workspace was opened") : Exception(message)
class NoAudioDeviceSelected(message: String = "No audio device was selected") : Exception(message)
class NoCursorPositionSelected(message: String = "Please open a file first, so that a Vidoc annotation can be made.") : Exception(message)
class NoVidocResultException(message: String = "Recording didn't return a valid Vidoc object.") : Exception(message)
