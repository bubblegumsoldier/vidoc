import { AuthorInformation } from "./AuthorInformation";
import {
    EditorPosition,
    EditorSelection,
    FocusInformation,
} from "./FocusInformation";

export interface VidocMetadata {
    createdAt: string;
    createdBy: AuthorInformation;
    focusInformation: FocusInformation;
}

export interface BoundsInformation {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ScreenInformation extends BoundsInformation {
    index: number;
    scale: {
        x: number;
        y: number;
    };
}

export interface RecordingAreaInformation {
    bounds: BoundsInformation;
    screen: ScreenInformation;
}

export interface Vidoc {
    id: string;
    metadata: VidocMetadata;
    tmpVideoFilePaths: string[]; //relative
    mergedTmpVideoFilePath?: string; //relative
    relativeFilePathMetadata: string;
    speechToText?: SpeechToTextInformation;
    recordingAreaInformation?: RecordingAreaInformation;
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
    uploadUrl?: string;
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

export interface HTMLPageOutput {
    html: string;
    path: string;
}
