import { AuthorInformation } from "./AuthorInformation";
import { EditorSelection, FocusInformation } from "./FocusInformation";

export interface VidocMetadata {
    createdAt: string;
    createdBy: AuthorInformation;
    focusInformation: FocusInformation
}

export interface Vidoc {
    id: string;
    relativeFilePath: string;
    relativeFilePathMetadata: string;
    absoluteFilePath: string;
    absoluteFilePathMetadata: string;
    metadata: VidocMetadata;
}

export interface PositionedVidocInstance {
    range: EditorSelection;
    vidoc: Vidoc;
}