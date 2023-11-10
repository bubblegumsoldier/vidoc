export interface VidocCloudAccessor {
  ensureLoggedIn(): Promise<void>;
  requestUploadLink(vidocId: string): Promise<string>;
}
