package com.hmdevconsulting.vidoc.ui

import com.intellij.lang.annotation.AnnotationHolder
import com.intellij.lang.annotation.Annotator
import com.intellij.lang.annotation.HighlightSeverity
import com.intellij.psi.PsiElement
import com.intellij.psi.util.elementType
import com.intellij.openapi.editor.colors.TextAttributesKey
import com.intellij.openapi.editor.markup.EffectType
import com.intellij.openapi.editor.markup.TextAttributes
import com.intellij.psi.tree.IElementType
import com.intellij.psi.tree.TokenSet
import java.awt.Color
import com.intellij.openapi.util.TextRange
import java.util.regex.Pattern


class VidocHighlighter : Annotator {
    companion object {
        val MY_PATTERN: Pattern = Pattern.compile(":vidoc\\s+\\S+")
    }

    override fun annotate(element: PsiElement, holder: AnnotationHolder) {
        val text = element.text
        val matcher = MY_PATTERN.matcher(text)

        while (matcher.find()) {
            val start = matcher.start()
            val end = matcher.end()

            // Create the annotation range, it's relative to the element's start offset
            val range = TextRange(start, end).shiftRight(element.textRange.startOffset)

            // For background color
            val attributes = TextAttributes(null, Color.YELLOW, null, EffectType.BOXED, 0)

            // Register the annotation
            holder.newSilentAnnotation(HighlightSeverity.INFORMATION)
                .range(range)
                .textAttributes(TextAttributesKey.createTempTextAttributesKey("MY_HIGHLIGHT", attributes))
                .create()

            // For tooltip
            holder.newAnnotation(HighlightSeverity.INFORMATION, "This is a Vidoc string")
                .range(range)
                .create()
        }
    }
}