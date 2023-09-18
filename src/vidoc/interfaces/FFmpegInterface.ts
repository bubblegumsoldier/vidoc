export interface FFmpegInterface {
    getAudioDevices(): Promise<string[]>;
    getPathToFFmpegBinary(): Promise<string>;
}