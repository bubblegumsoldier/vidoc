import { EditorSelection } from "../model/FocusInformation";

export function checkSelectionOverlap(
  selection1: EditorSelection,
  selection2: EditorSelection
): boolean {
  // Check if the line indices are the same
  if (selection1.from.lineIndex === selection2.from.lineIndex) {
    // Check if the selections overlap on the line
    if (
      (selection1.from.charIndex <= selection2.to.charIndex &&
        selection1.to.charIndex >= selection2.from.charIndex) ||
      (selection2.from.charIndex <= selection1.to.charIndex &&
        selection2.to.charIndex >= selection1.from.charIndex)
    ) {
      return true; // Overlapping selections
    }
  }
  return false; // Non-overlapping selections
}
