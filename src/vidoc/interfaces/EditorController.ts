import { FocusInformation } from "../model/FocusInformation";

export interface EditorController {
    startIndicationOfRecording(): void;
    stopIndicationOfRecording(): void;
    getCurrentFocusInformation(): Promise<FocusInformation>;
}