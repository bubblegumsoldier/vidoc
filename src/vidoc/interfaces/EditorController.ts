export interface EditorController {
    startIndicationOfRecording(): void;
    stopIndicationOfRecording(): void;
    notify(s: string): void;
}