import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../../model/Vidoc";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { FileController } from "../../../interfaces/FileController";
import { SpeechToText } from "../../../interfaces/SpeechToText";
import { VidocFactory } from "../../../interfaces/VidocFactory";
import { AWSTranscribeSpeechToText } from "./AWSTranscribeSpeechToText";
import { Notificator } from "../../../interfaces/Notificator";
import { VidocCloudTranscribeSpeechToText } from "./VidocCloudTranscribeSpeechToText";

@injectable()
export class SpeechToTextPostprocessor implements VideoPostprocessor {
    constructor(
        @inject("FileController") private fileController: FileController,
        @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
        @inject("VidocFactory") private vidocFactory: VidocFactory,
        @inject("AWSTranscribeSpeechToText")
        private awsTranscribe: AWSTranscribeSpeechToText,
        @inject("Notificator") private notificator: Notificator,
        @inject("VidocCloudTranscribeSpeechToText")
        private vidocCloudSpeechToText: VidocCloudTranscribeSpeechToText
    ) {}

    async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
        const config = await this.configRetriever.getConfig();
        if (
            !config.recordingOptions?.postProcessingOptions?.speechToText
                ?.enabled
        ) {
            throw Error("Speech to text is not enabled in the config");
        }
        let speechToTextConverter;
        if (
            config.recordingOptions.postProcessingOptions.speechToText.type ===
            "aws-transcribe"
        ) {
            speechToTextConverter = this.awsTranscribe;
        } else if (config.savingStrategy.type === "vidoc.cloud") {
            speechToTextConverter = this.vidocCloudSpeechToText;
        }
        if (!speechToTextConverter) {
            this.notificator.warn(
                "Speech to text was enabled but no converter was found. Please check your config."
            );
            return vidoc;
        }
        const speechToText = await speechToTextConverter.convertSpeechToText(
            vidoc
        );
        vidoc.speechToText = speechToText;
        await this.vidocFactory.save(vidoc);
        return vidoc;
    }
}
