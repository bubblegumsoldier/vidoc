export interface PreferencesManager {
    getPreferredAudioInterface(): Promise<string | undefined>;
    setPreferredAudioInterface(preferredAudioInterface: string | undefined): Promise<void>;
    setCurrentVidocCloudToken(token: string | undefined): Promise<void>
    getCurrentVidocCloudToken(): Promise<string | undefined>
}