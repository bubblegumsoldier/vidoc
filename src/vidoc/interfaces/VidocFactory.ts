import { FocusInformation } from "../model/FocusInformation";
import { Vidoc } from "../model/Vidoc";

export interface VidocFactory {
    init(id: string): Promise<Vidoc>;
    create(focusInformation?: FocusInformation): Promise<Vidoc>;
    save(vidoc: Vidoc): Promise<void>;
}