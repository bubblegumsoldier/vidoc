package com.hmdevconsulting.vidoc.ui.visitors

import com.intellij.openapi.editor.colors.TextAttributesKey
import com.intellij.openapi.editor.markup.TextAttributes
import com.intellij.psi.PsiElement
import java.awt.Color
import com.jetbrains.python.psi.PyStringLiteralExpression

import com.intellij.lang.annotation.AnnotationHolder
import com.intellij.lang.annotation.Annotator
import com.intellij.lang.annotation.HighlightSeverity

class VidocHighlightAnnotator : Annotator {

    private val vidocPattern = Regex(":vidoc \\S+")

    override fun annotate(element: PsiElement, holder: AnnotationHolder) {
        if (element is PyStringLiteralExpression && vidocPattern.containsMatchIn(element.text)) {
            val attributes = TextAttributes()
            attributes.backgroundColor = Color.YELLOW

            val textAttributesKey = TextAttributesKey.createTextAttributesKey("VIDOC_STRING", attributes)
            val range = element.textRange

            holder.newSilentAnnotation(HighlightSeverity.INFORMATION)
                .range(range)
                .textAttributes(textAttributesKey)
                .create()
        }
    }
}

