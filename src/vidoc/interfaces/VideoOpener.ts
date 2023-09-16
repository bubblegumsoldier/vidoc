import { Vidoc } from "../model/Vidoc";

export interface VideoOpener {
    openVideo(vidoc: Vidoc): Promise<void>;
    openVideoById(vidocId: string): Promise<void>;
}