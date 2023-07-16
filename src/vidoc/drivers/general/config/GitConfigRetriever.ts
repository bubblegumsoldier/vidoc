import { inject, injectable } from "tsyringe";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { Config } from "../../../model/Config";
import { FileController } from "../../../interfaces/FileController";
import * as _ from "lodash";
import { DEFAULT_CONFIG } from "./defaultConfig";

const DEFAULT_CONFIG_PATH = [".vidocconf.json", ".vidocconf.yaml"];

@injectable()
export class GitConfigRetriever implements ConfigRetriever {
  constructor(
    @inject("FileController") private fileController: FileController
  ) {}

  async getConfig(): Promise<Config> {
    const existingConfigs = <string[]>(
      await Promise.all(
        DEFAULT_CONFIG_PATH.map(async (c: string) => {
          const exists = await this.fileController.existsSync(c);
          return exists ? c : null;
        })
      )
    ).filter((c) => !!c);

    if (existingConfigs.length > 1) {
      throw Error(
        `Cannot have more than one vidoc configs: ${existingConfigs}`
      );
    }

    let existingConfig = {};
    if (existingConfigs.length === 1) {
      existingConfig = await this.parseVidocConfigAtFilepath(
        existingConfigs[0]
      );
    }
    return _.merge(DEFAULT_CONFIG, existingConfig);
  }

  private async parseVidocConfigAtFilepath(filepath: string): Promise<any> {
    const fileContent = await this.fileController.readFileContent(filepath, true);
    if (filepath.endsWith("json")) {
      return JSON.parse(fileContent);
    }
    if (filepath.endsWith(".yaml")) {
      throw Error("YAML parsing not yet implemented");
    }
  }
}
