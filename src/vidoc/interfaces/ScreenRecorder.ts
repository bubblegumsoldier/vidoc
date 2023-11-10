import { Vidoc } from "../model/Vidoc";

export interface ScreenRecorder {
    continueOrStartRecording(vidoc: Vidoc): Promise<Vidoc>;
    continueOrStartRecordingWithAudioDevice(vidoc: Vidoc, audioDevice: string): Promise<Vidoc>;
    stopRecording(): Promise<Vidoc>;
    isRecording(): boolean;
}