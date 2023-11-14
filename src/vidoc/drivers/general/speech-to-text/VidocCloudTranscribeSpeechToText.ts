import { inject, injectable } from "tsyringe";
import { SpeechToText } from "../../../interfaces/SpeechToText";
import { SpeechToTextInformation, Vidoc } from "../../../model/Vidoc";
import { VidocCloudAccessor } from "../../../interfaces/VidocCloudAccessor";

@injectable()
export class VidocCloudTranscribeSpeechToText implements SpeechToText {
    constructor(
        @inject("VidocCloudAccessor")
        private vidocCloudAccessor: VidocCloudAccessor
    ) {}

    async convertSpeechToText(vidoc: Vidoc): Promise<SpeechToTextInformation> {
        if (!(<any>vidoc).remoteVideoUrl) {
            throw new Error(
                "Cannot convert speech to text without a remote video url"
            );
        }
        return await this.vidocCloudAccessor.getVidocTranscript(vidoc.id);
    }
}
