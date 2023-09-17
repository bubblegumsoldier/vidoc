export interface FFmpegInterface {
    getWinAudioDevices(): Promise<string[]>;
    getPathToFFmpegBinary(): Promise<string>;
}