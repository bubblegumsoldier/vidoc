import { AuthorInformation } from "./AuthorInformation";
import { EditorSelection, FocusInformation } from "./FocusInformation";

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