import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { LocalMetadataLocalVideoVidoc, Vidoc } from "../../../model/Vidoc";
import { FileController } from "../../../interfaces/FileController";

@injectable()
export class TmpToFilePostprocessor implements VideoPostprocessor {
  constructor(
    @inject("FileController") private fileController: FileController,
  ) {}

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    const correctVidoc = <LocalMetadataLocalVideoVidoc>(vidoc);

    if(!correctVidoc.relativeFilePathToVideo) {
        throw Error('absoluteFilePath is not set');
    }

    if(!vidoc.mergedTmpVideoFilePath) {
        throw Error('mergedTmpVideoFilePath is not set');
    }

    await this.fileController.moveFile(vidoc.mergedTmpVideoFilePath, correctVidoc.relativeFilePathToVideo, true);

    return vidoc;
  }
}
