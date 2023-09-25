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
import java.io.IOException
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
        val navigationHandler = GutterIconNavigationHandler<PsiElement> { _, elementInner ->
            // Handle the navigation action here.
            // 'e' is the MouseEvent, and 'element' is the associated PsiElement.
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                var controller = elementInner.project.service<VidocIntelliJController>()
                val vidocId = VidocHighlight.getVidocId(element, false)
                vidocId?: throw Exception("No vidocId found")
                // Later we might integrate it into IntelliJ... no now though...
                val htmlOutput = controller.getVidocHTMLPage(vidocId)
                htmlOutput.path?: throw Exception("No HTML file could be generated")
                val path = Paths.get(htmlOutput.path)
                try {
                    Desktop.getDesktop().open(path.toFile())
                } catch (e: IOException) {
                    e.printStackTrace()
                }

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


