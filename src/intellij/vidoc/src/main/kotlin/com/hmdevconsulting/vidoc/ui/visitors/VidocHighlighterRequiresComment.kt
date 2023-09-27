package com.hmdevconsulting.vidoc.ui.visitors

import com.intellij.openapi.editor.colors.TextAttributesKey
import com.intellij.openapi.editor.markup.TextAttributes
import com.intellij.psi.PsiElement
import java.awt.Color

import com.intellij.lang.annotation.AnnotationHolder
import com.intellij.lang.annotation.Annotator
import com.intellij.lang.annotation.HighlightSeverity
import com.intellij.openapi.editor.DefaultLanguageHighlighterColors
import com.intellij.openapi.editor.markup.EffectType
import com.intellij.ui.JBColor

open class VidocHighlighterRequiresComment : Annotator {

    open fun isHighlighted(element: PsiElement): Boolean {
        return VidocHighlight.getVidocId(element, true) != null
    }

    override fun annotate(element: PsiElement, holder: AnnotationHolder) {
        if (!isHighlighted(element)) {
            return;
        }
        val attributes = TextAttributes()

        // For a very light transparent yellow background.
        attributes.backgroundColor = Color(255, 255, 0, 64) // RGBA: A value of 64 out of 255 for transparency

        // For yellow rounded border
        attributes.effectType = EffectType.ROUNDED_BOX
        attributes.effectColor = JBColor.YELLOW

        val textAttributesKey = TextAttributesKey.createTextAttributesKey(
            "VIDOC_STRING",
            DefaultLanguageHighlighterColors.HIGHLIGHTED_REFERENCE
        )
        val range = element.textRange

        holder.newSilentAnnotation(HighlightSeverity.INFORMATION)
            .range(range)
            .textAttributes(textAttributesKey)
            .create()

    }


}
