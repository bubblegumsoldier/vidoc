package com.hmdevconsulting.vidoc.ui.visitors

import com.intellij.psi.PsiComment
import com.intellij.psi.PsiElement

class VidocHighlight {
    companion object {
        @JvmStatic
        fun getVidocId(element: PsiElement, requiresComment: Boolean): String? {
            val vidocPattern = Regex(":vidoc (\\S+)")
            if (element is PsiComment || !requiresComment) {
                val matchResult = vidocPattern.find(element.text)
                return matchResult?.groups?.get(1)?.value // Return the first capturing group, i.e., the ID part.
            }
            return null
        }

    }
}