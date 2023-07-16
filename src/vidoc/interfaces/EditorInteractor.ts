import { EditorPosition } from "../model/FocusInformation";

export interface EditorInteractor {
    insertStringAtEndOfLine(s: string, cursorPosition: EditorPosition): Promise<void>;
}