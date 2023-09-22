package com.hmdevconsulting.vidoc.model


data class VidocMetadata(
    val createdAt: String,
    val createdBy: AuthorInformation,
    val focusInformation: FocusInformation
)

data class Vidoc(
    val id: String,
    val metadata: VidocMetadata,
    val tmpVideoFilePath: String,
    val relativeFilePathMetadata: String,
    val speechToText: SpeechToTextInformation? = null,
    val relativeFilePathToVideo: String? = null,
    val remoteVideoUrl: String? = null
)

data class SpeechToTextInformation(
    val text: String,
    val payload: Any
)

data class PositionedVidocInstance(
    val range: EditorSelection,
    val vidoc: Vidoc
)

data class VidocReference(
    val relativeFilePath: String,
    val vidoc: Vidoc,
    val editorPosition: EditorPosition
)

data class EditorPosition(
    val lineIndex: Int,
    val charIndex: Int,
    val lineContent: String
)

data class EditorSelection(
    val from: EditorPosition,
    val to: EditorPosition,
    val text: String
)

data class GivenFocusInformation(
    val cursorPosition: EditorPosition,
    val currentSelection: EditorSelection,
    val currentlyOpenedFileRelativeFilePath: String
)

typealias FocusInformation = GivenFocusInformation?

data class GivenAuthorInformation(
    val username: String? = null,
    val fullName: String? = null,
    val email: String? = null
)

typealias AuthorInformation = GivenAuthorInformation?
