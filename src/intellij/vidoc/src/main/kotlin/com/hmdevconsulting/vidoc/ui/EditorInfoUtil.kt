package com.hmdevconsulting.vidoc.ui

import com.hmdevconsulting.vidoc.model.EditorPosition
import com.hmdevconsulting.vidoc.model.EditorSelection
import com.hmdevconsulting.vidoc.model.FocusInformation
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.editor.Editor
import com.intellij.openapi.fileEditor.FileDocumentManager
import com.intellij.openapi.vfs.VirtualFile

class EditorInfoUtil private constructor() {

    companion object {

        @JvmStatic
        fun getFocusInformation(event: AnActionEvent): FocusInformation? {
            val editor = event.getData(com.intellij.openapi.actionSystem.CommonDataKeys.EDITOR) ?: return null
            val project = event.project ?: return null
            val document = editor.document
            val file = FileDocumentManager.getInstance().getFile(document) ?: return null

            val selectionModel = editor.selectionModel

            val offsetStart = selectionModel.selectionStart
            val offsetEnd = selectionModel.selectionEnd
            val selectedText = selectionModel.selectedText ?: ""

            val startPosition = offsetToPosition(editor, offsetStart)
            val endPosition = offsetToPosition(editor, offsetEnd)

            val relativeFilePath = getRelativePath(file, project.basePath ?: "")

            return FocusInformation(
                cursorPosition = startPosition,
                currentSelection = EditorSelection(from = startPosition, to = endPosition, text = selectedText),
                currentlyOpenedFileRelativeFilePath = relativeFilePath
            )
        }

        private fun offsetToPosition(editor: Editor, offset: Int): EditorPosition {
            val logicalPosition = editor.offsetToLogicalPosition(offset)
            val line = editor.document.getText(com.intellij.openapi.util.TextRange.create(
                editor.document.getLineStartOffset(logicalPosition.line),
                editor.document.getLineEndOffset(logicalPosition.line)
            ))
            return EditorPosition(
                lineIndex = logicalPosition.line,
                charIndex = logicalPosition.column,
                lineContent = line
            )
        }

        private fun getRelativePath(file: VirtualFile, basePath: String): String {
            return file.path.substringAfter(basePath, file.path)
        }
    }
}
