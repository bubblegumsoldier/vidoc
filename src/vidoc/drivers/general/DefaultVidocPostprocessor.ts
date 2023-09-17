import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../model/Vidoc";
import { FileUploadPostprocessor } from "./file-upload/FileUploadPostprocessor";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { TmpToFilePostprocessor } from "./file-upload/TmpToFilePostprocessor";
import { SpeechToTextPostprocessor } from "./speech-to-text/SpeechToTextPostprocessor";

@injectable()
export class DefaultVidocPostprocessor implements VideoPostprocessor {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("TmpToFilePostprocessor")
    private tmpToFilePostprocessor: TmpToFilePostprocessor,
    @inject("FileUploadPostprocessor")
    private fileUploadPostprocessor: FileUploadPostprocessor,
    @inject("SpeechToTextPostprocessor")
    private speechToTextPostprocessor: SpeechToTextPostprocessor
  ) {}

  private async getRelevantPostprocessors(): Promise<VideoPostprocessor[]> {
    const config = await this.configRetriever.getConfig();
    let postprocessors: VideoPostprocessor[] = [];
    if (config.savingStrategy.type === "local") {
      postprocessors.push(this.tmpToFilePostprocessor);
    } else if (config.savingStrategy.type === "remote") {
      postprocessors.push(this.fileUploadPostprocessor);
    }
    if (config.recordingOptions?.postProcessingOptions?.speechToText?.enabled) {
      postprocessors.push(this.speechToTextPostprocessor);
    }
    return postprocessors;
  }

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    const relevantPostprocessors = await this.getRelevantPostprocessors();
    for (const pp of relevantPostprocessors) {
      vidoc = await pp.postprocessVidoc(vidoc);
    }
    return vidoc;
  }
}
