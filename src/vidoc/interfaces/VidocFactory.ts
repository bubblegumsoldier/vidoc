import { FocusInformation } from "../model/FocusInformation";
import { Vidoc } from "../model/Vidoc";

export interface VidocFactory {
    initVidocObject(id: string): Promise<Vidoc>;
    createVidocObject(focusInformation?: FocusInformation): Promise<Vidoc>;
    updateVidocMetadataFile(vidoc: Vidoc): Promise<void>;
}