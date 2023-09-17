export interface FFmpegInterface {
    getWinAudioDevices(): Promise<string[]>;
}