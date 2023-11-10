import { FocusInformation } from "../model/FocusInformation";

export interface EditorController {
    updateIndicationBasedOnState(): Promise<void>;
    getCurrentFocusInformation(): Promise<FocusInformation>;
}