package com.hmdevconsulting.vidoc.ui.visitors

import com.hmdevconsulting.vidoc.controller.VidocIntelliJController
import com.hmdevconsulting.vidoc.exceptions.NoWorkspaceOpened
import com.intellij.codeInsight.daemon.GutterIconNavigationHandler
import com.intellij.codeInsight.daemon.RelatedItemLineMarkerInfo
import com.intellij.codeInsight.daemon.RelatedItemLineMarkerProvider
import com.intellij.codeInsight.navigation.NavigationGutterIconBuilder
import com.intellij.icons.AllIcons
import com.intellij.navigation.GotoRelatedItem
import com.intellij.openapi.components.service
import com.intellij.openapi.editor.markup.GutterIconRenderer
import com.intellij.openapi.util.NotNullFactory
import com.intellij.psi.PsiElement
import java.awt.Desktop
import java.net.URI
import java.nio.file.Paths


open class VidocLineMarkerProviderRequiresComment : RelatedItemLineMarkerProvider() {
    open fun isHighlighted(element: PsiElement): Boolean {
        return VidocHighlight.getVidocId(element, true) != null
    }

    override fun collectNavigationMarkers(
        element: PsiElement,
        result: MutableCollection<in RelatedItemLineMarkerInfo<*>>
    ) {
        if (!isHighlighted(element)) {
            return;
        }

        val tooltipProvider: (Any?) -> String = { "View Vidoc" };
        val navigationHandler = GutterIconNavigationHandler<PsiElement> { e, element ->
            // Handle the navigation action here.
            // 'e' is the MouseEvent, and 'element' is the associated PsiElement.
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                var controller = element.project?.service<VidocIntelliJController>()
                controller ?: throw Exception("Controller not found")
                var vidoc = controller.getVidoc(
                    VidocHighlight.getVidocId(element, false) ?: throw Exception("No Vidoc Element found here?")
                )
                // TODO: Generate a temporary html page using the CLI and go that HTML page in the browser
                // Later we might integrate it into IntelliJ... no now though...
                val basePath = Paths.get(element.project.basePath?: throw NoWorkspaceOpened())
                val url = if (vidoc.remoteVideoUrl != null) {
                    vidoc.remoteVideoUrl
                } else {
                    basePath.resolve(
                        Paths.get(
                            vidoc.relativeFilePathToVideo ?: throw Exception("No path found")
                        )
                    ).toString()
                }
                Desktop.getDesktop().browse(URI.create(url?: throw Exception("No URL could be generated")))
            }
        }
        val factory = NotNullFactory {
            // construct and return a non-null Collection<GotoRelatedItem>
            listOf<GotoRelatedItem>()  // returning an empty list as a placeholder
        }

        val marker: RelatedItemLineMarkerInfo<*> = RelatedItemLineMarkerInfo<PsiElement>(
            element,
            element.textRange,
            AllIcons.Actions.Preview,
            tooltipProvider,
            navigationHandler,
            GutterIconRenderer.Alignment.CENTER,
            factory
        )
        result.add(marker)
    }
}


