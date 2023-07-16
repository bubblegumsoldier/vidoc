import { FocusInformation } from "../model/FocusInformation";

export interface EditorController {
    startIndicationOfRecording(): void;
    stopIndicationOfRecording(): void;
    notify(s: string): void;
    getCurrentFocusInformation(): Promise<FocusInformation>;
}