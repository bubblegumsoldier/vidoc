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

    if(!correctVidoc.absoluteFilePath) {
        throw Error('absoluteFilePath is not set');
    }

    await this.fileController.moveFile(vidoc.tmpVideoFilePath, correctVidoc.absoluteFilePath, true);

    return vidoc;
  }
}
