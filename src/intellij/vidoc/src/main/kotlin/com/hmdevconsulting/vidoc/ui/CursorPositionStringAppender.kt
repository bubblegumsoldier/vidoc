import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.openapi.editor.Editor

class CursorPositionStringAppender {

    companion object {
        fun appendToCurrentCursorPosition(event: AnActionEvent, stringToAppend: String) {
            val project = event.project
            val editor: Editor? = event.getData(com.intellij.openapi.actionSystem.PlatformDataKeys.EDITOR)
            val document = editor?.document ?: return

            WriteCommandAction.runWriteCommandAction(project) {
                val caretModel = editor.caretModel
                val offset = caretModel.offset
                document.insertString(offset, stringToAppend)
            }
        }
    }
}
