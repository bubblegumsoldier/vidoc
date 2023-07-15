export interface ScreenRecorder {
    startRecording(outputFilePath: string): Promise<void>;
    stopRecording(): Promise<string>;
    isRecording(): boolean;
}