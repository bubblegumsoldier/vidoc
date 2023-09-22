package com.hmdevconsulting.vidoc.ui

import com.hmdevconsulting.vidoc.controller.ControllerFactory
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.hmdevconsulting.vidoc.model.VidocPluginState
import com.hmdevconsulting.vidoc.ui.icons.VidocIcons
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.Presentation
import com.intellij.openapi.ui.Messages
import javax.swing.Icon
import com.intellij.ui.AnimatedIcon
import kotlinx.coroutines.*

class RecordButtonAction : AnAction() {
    private val job = Job()
    private val scope = CoroutineScope(Dispatchers.Default + job)

    override fun update(e: AnActionEvent) {
        if(e.project?.basePath == null) {
            return;
        }
        val controller = ControllerFactory.getAccessor()
        controller.projectBasePath = e.project?.basePath;
        val presentation: Presentation = e.presentation
        val icon: Icon = if (controller.state == VidocPluginState.IDLE) {
            VidocIcons.RecordIcon
        } else {
            AnimatedIcon.Default()
        }
        presentation.icon = icon
        presentation.text = if (controller.state == VidocPluginState.IDLE) {
            "Record Vidoc"
        } else if(controller.state == VidocPluginState.RECORDING) {
            "Recording Vidoc..."
        } else {
            "Postprocessing Vidoc..."
        }
    }

    override fun actionPerformed(e: AnActionEvent) {

        scope.launch {
            val controller = ControllerFactory.getAccessor()
            controller.projectBasePath = e.project?.basePath
            val config = controller.getConfig()
            withContext(Dispatchers.Main) {
                Messages.showMessageDialog(e.project, config.toString(), "Config Information", Messages.getInformationIcon())
            }
        }
    }

    fun dispose() {
        job.cancel() // call this when the class instance is no longer needed
    }
}
