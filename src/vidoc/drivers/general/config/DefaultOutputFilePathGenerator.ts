import { inject, injectable } from "tsyringe";
import { OutputFilePathGenerator } from "../../../interfaces/OutputFilePathGenerator";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { FileController } from "../../../interfaces/FileController";
import * as path from "path";
import { uniqueId } from "lodash";

@injectable()
export class DefaultOutputFilePathGenerator implements OutputFilePathGenerator {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("FileController") private fileController: FileController
  ) {}

  async getNextOutputFilePath(): Promise<string> {
    const config = await this.configRetriever.getConfig();
    if (
      config.savingStrategy.type === "local" &&
      config.savingStrategy.location === "central"
    ) {
      return this.fileController.getAbsolutePath(
        path.resolve(config.savingStrategy.folder, uniqueId())
      );
    }
    throw Error("Only local and central file saving strategy supported atm");
  }
}
