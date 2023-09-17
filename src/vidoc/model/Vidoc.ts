import { AuthorInformation } from "./AuthorInformation";
import { EditorPosition, EditorSelection, FocusInformation } from "./FocusInformation";

export interface VidocMetadata {
    createdAt: string;
    createdBy: AuthorInformation;
    focusInformation: FocusInformation
}

export interface Vidoc {
    id: string;
    metadata: VidocMetadata;
    tmpVideoFilePath: string; //relative
    relativeFilePathMetadata: string;
    speechToText?: SpeechToTextInformation;
}

export interface SpeechToTextInformation {
    text: string;
    payload: any;
}

export interface LocalMetadataLocalVideoVidoc extends Vidoc {
    relativeFilePathToVideo: string;
}

export interface LocalMetaDataRemoteVideoVidoc extends Vidoc {
    remoteVideoUrl: string;
}

export interface PositionedVidocInstance {
    range: EditorSelection;
    vidoc: Vidoc;
}

export interface VidocReference {
    relativeFilePath: string;
    vidoc: Vidoc;
    editorPosition: EditorPosition;
}