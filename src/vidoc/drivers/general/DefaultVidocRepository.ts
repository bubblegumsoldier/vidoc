import { inject, injectable } from "tsyringe";
import { VidocRepository } from "../../interfaces/VidocRepository";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { FileController } from "../../interfaces/FileController";
import { Vidoc, VidocReference } from "../../model/Vidoc";
import * as vscode from "vscode";

@injectable()
export class DefaultVidocRepository implements VidocRepository {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("VidocFactory") private vidocFactory: VidocFactory
  ) {}

  async getAllVidocs(): Promise<Vidoc[]> {
    const rootFilePath = ".vidoc";
    const vidocFilePaths = await this.fileController.getAllFilesInFolder(
      rootFilePath,
      true
    );
    const vidocIds = vidocFilePaths.filter((path) => path.endsWith(".json"));
    return await Promise.all(
      vidocIds.map((vidocId) => this.vidocFactory.initVidocObject(vidocId))
    );
  }
}
