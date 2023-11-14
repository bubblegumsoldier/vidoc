import { SpeechToTextInformation } from "../model/Vidoc";

export interface VidocCloudAccessor {
  ensureLoggedIn(): Promise<void>;
  requestUploadLink(vidocId: string): Promise<string>;
  getVidocTranscript(vidocId: string): Promise<SpeechToTextInformation>
}
