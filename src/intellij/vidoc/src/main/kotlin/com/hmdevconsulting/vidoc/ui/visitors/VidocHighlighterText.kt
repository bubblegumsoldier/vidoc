package com.hmdevconsulting.vidoc.ui.visitors

import com.intellij.psi.PsiElement
import com.intellij.psi.PsiPlainText

class VidocHighlighterText : VidocHighlighterRequiresComment() {
    override fun isHighlighted(element: PsiElement): Boolean {
        return element is PsiPlainText && VidocHighlight.getVidocId(element, false) != null
    }
}