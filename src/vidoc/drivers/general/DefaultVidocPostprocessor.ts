import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../model/Vidoc";
import { FileUploadPostprocessor } from "./file-upload/FileUploadPostprocessor";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { TmpToFilePostprocessor } from "./file-upload/TmpToFilePostprocessor";
import { SpeechToTextPostprocessor } from "./speech-to-text/SpeechToTextPostprocessor";
import { VidocCloudUploadUrlRemover } from "./file-upload/VidocCloudUploadUrlRemover";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { VideoMerger } from "./VideoMerger";
import { TmpCleanup } from "./TmpCleanup";
import { SavingStrategyVidocCloud } from "../../model/Config";

@injectable()
export class DefaultVidocPostprocessor implements VideoPostprocessor {
    constructor(
        @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
        @inject("TmpToFilePostprocessor")
        private tmpToFilePostprocessor: TmpToFilePostprocessor,
        @inject("FileUploadPostprocessor")
        private fileUploadPostprocessor: FileUploadPostprocessor,
        @inject("SpeechToTextPostprocessor")
        private speechToTextPostprocessor: SpeechToTextPostprocessor,
        @inject("VidocCloudUploadUrlRemover")
        private vidocCloudUploadUrlRemover: VidocCloudUploadUrlRemover,
        @inject("VidocFactory") private vidocFactory: VidocFactory,
        @inject("VideoMerger") private videoMerger: VideoMerger,
        @inject("TmpCleanup") private tmpCleanup: TmpCleanup
    ) {}

    private async getRelevantPostprocessors(): Promise<VideoPostprocessor[]> {
        const config = await this.configRetriever.getConfig();
        let postprocessors: VideoPostprocessor[] = [this.videoMerger];
        if (config.savingStrategy.type === "local") {
            postprocessors.push(this.tmpToFilePostprocessor);
        } else if (config.savingStrategy.type === "remote") {
            postprocessors.push(this.fileUploadPostprocessor);
        } else if (config.savingStrategy.type === "vidoc.cloud") {
            postprocessors.push(this.fileUploadPostprocessor);
            postprocessors.push(this.vidocCloudUploadUrlRemover);
        }
        if (await this.transcriptionIsEnabled()) {
            postprocessors.push(this.speechToTextPostprocessor);
        }
        postprocessors.push(this.tmpCleanup);

        return postprocessors;
    }

    private async transcriptionIsEnabled(): Promise<boolean> {
        /**
         * Transcription is enabled if:
         * - The user has enabled it in config.recordingOptions.postProcessingOptions.speechToText.enabled
         * or
         * - The user is using vidoc.cloud and has not disabled it in config.savingStrategy.disableTranscription
         */
        const config = await this.configRetriever.getConfig();
        return (
            config.recordingOptions?.postProcessingOptions?.speechToText
                ?.enabled ||
            (config.savingStrategy.type === "vidoc.cloud" &&
                (<SavingStrategyVidocCloud>config.savingStrategy)
                    .disableTranscription !== true)
        );
    }

    async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
        const relevantPostprocessors = await this.getRelevantPostprocessors();
        for (const pp of relevantPostprocessors) {
            vidoc = await pp.postprocessVidoc(vidoc);
        }
        await this.vidocFactory.save(vidoc);
        return vidoc;
    }
}
