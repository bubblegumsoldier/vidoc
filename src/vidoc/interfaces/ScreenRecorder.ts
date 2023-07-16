import { Vidoc } from "../model/Vidoc";

export interface ScreenRecorder {
    startRecording(vidoc: Vidoc): Promise<void>;
    stopRecording(): Promise<Vidoc>;
    isRecording(): boolean;
}