export interface AudioDeviceSelector {
    getAudioDevice(): Promise<string | undefined>;
    forceReselectOfAudioDevice(): Promise<string | undefined>;
}