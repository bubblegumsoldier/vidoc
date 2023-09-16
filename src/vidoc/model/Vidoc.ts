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
    absoluteFilePathMetadata: string;
}

export interface LocalMetadataLocalVideoVidoc extends Vidoc {
    relativeFilePath: string;
    absoluteFilePath: string;
}

export interface LocalMetaDataRemoteVideoVidoc extends Vidoc {
    remoteVideoUrl: string;
}

export interface PositionedVidocInstance {
    range: EditorSelection;
    vidoc: Vidoc;
}