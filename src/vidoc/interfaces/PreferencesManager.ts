export interface PreferencesManager {
    getPreferredAudioInterface(): Promise<string | undefined>;
    setPreferredAudioInterface(preferredAudioInterface: string | undefined): Promise<void>;
}