import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../model/Vidoc";
import { FileUploadPostprocessor } from "./file-upload/FileUploadPostprocessor";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { TmpToFilePostprocessor } from "./file-upload/TmpToFilePostprocessor";

@injectable()
export class DefaultVidocPostprocessor implements VideoPostprocessor {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("TmpToFilePostprocessor")
    private tmpToFilePostprocessor: TmpToFilePostprocessor,
    @inject("FileUploadPostprocessor")
    private fileUploadPostprocessor: FileUploadPostprocessor
  ) {}

  private async getRelevantPostprocessors(): Promise<VideoPostprocessor[]> {
    if (
      (await this.configRetriever.getConfig()).savingStrategy.type === "local"
    ) {
      return [this.tmpToFilePostprocessor];
    } else if (
      (await this.configRetriever.getConfig()).savingStrategy.type === "remote"
    ) {
      return [this.fileUploadPostprocessor];
    }
    return [];
  }

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    const relevantPostprocessors = await this.getRelevantPostprocessors();
    for(const pp of relevantPostprocessors) {
        vidoc = await pp.postprocessVidoc(vidoc);
    }
    return vidoc;
  }
}
