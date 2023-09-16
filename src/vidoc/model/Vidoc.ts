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
    tmpVideoFilePath: string;
}

export interface LocalMetadataLocalVideoVidoc extends Vidoc {
    relativeFilePath: string;
    absoluteFilePath: string;
    relativeFilePathMetadata: string;
    absoluteFilePathMetadata: string;
}

export interface LocalMetaDataRemoteVideoVidoc extends Vidoc {
    remoteVideoUrl: string;
    relativeFilePathMetadata: string;
    absoluteFilePathMetadata: string;
}

export interface PositionedVidocInstance {
    range: EditorSelection;
    vidoc: Vidoc;
}