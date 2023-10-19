export interface VidocCloudAccessor {
    ensureLoggedIn(): Promise<void>;
    requestUploadLink(): Promise<string>;
}