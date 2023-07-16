export interface EditorPosition {
    lineIndex: number;
    charIndex: number;
    lineContent: string;
}

export interface EditorSelection {
    from: EditorPosition;
    to: EditorPosition;
    text: string;
}

export interface GivenFocusInformation {
    cursorPosition: EditorPosition;
    currentSelection: EditorSelection;
    currentlyOpenedFileRelativeFilePath: string;
}

export declare type FocusInformation = GivenFocusInformation|undefined;