import { inject, injectable } from "tsyringe";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { Config } from "../../../model/Config";
import { FileController } from "../../../interfaces/FileController";
import * as _ from "lodash";
import { DEFAULT_CONFIG } from "./defaultConfig";

const DEFAULT_CONFIG_PATH = [".vidocconf.json", ".vidocconf.yaml"];
const DEFAULT_SECRET_CONFIG_PATH = [".vidocsecrets"];

declare type SecretsMap = { [key: string]: string };

@injectable()
export class GitConfigRetriever implements ConfigRetriever {
  constructor(
    @inject("FileController") private fileController: FileController
  ) {}

  async getConfig(): Promise<Config> {
    const existingConfigs = <string[]>(
      await Promise.all(
        DEFAULT_CONFIG_PATH.map(async (c: string) => {
          const exists = await this.fileController.exists(c);
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
    const config = _.merge(DEFAULT_CONFIG, existingConfig);
    const postprocessedConfig = await this.postProcessConfigForEnv(config);
    return postprocessedConfig;
  }

  private async getSecretsKeyValue(): Promise<SecretsMap> {
    const existingSecretFiles = <string[]>(
      await Promise.all(
        DEFAULT_SECRET_CONFIG_PATH.map(async (c: string) => {
          const exists = await this.fileController.exists(c);
          return exists ? c : null;
        })
      )
    ).filter((c) => !!c);

    if (existingSecretFiles.length <= 0) {
      return {};
    }

    if (existingSecretFiles.length > 1) {
      throw Error(
        `Cannot have more than one vidoc configs: ${existingSecretFiles}`
      );
    }

    // parse secrets
    let secrets: SecretsMap = {};
    const fileContent = await this.fileController.readFileContent(
      existingSecretFiles[0],
      true
    );
    const lines = fileContent.split("\n");
    for (const line of lines) {
      if (line.trim() === "") {
        continue;
      }
      if (line.trim().indexOf("=") < 0) {
        continue;
      }
      if(line.trim().indexOf("#") === 0) {
        continue;
      }
      const [key, value] = line.trim().split("=");
      secrets[key] = value;
    }
    return secrets;
  }

  private async parseVidocConfigAtFilepath(filepath: string): Promise<Config> {
    const fileContent = await this.fileController.readFileContent(
      filepath,
      true
    );
    if (filepath.endsWith("json")) {
      return <Config>JSON.parse(fileContent);
    }
    if (filepath.endsWith(".yaml")) {
      throw Error("YAML parsing not yet implemented");
    }
    throw Error(`Cannot parse config at ${filepath}`);
  }

  private async replaceSecretsInString(
    str: string,
    secrets: { [key: string]: string }
  ): Promise<string> {
    return str.replace(/\$\{(\w+)\}/g, (match, variableName) => {
      if (secrets.hasOwnProperty(variableName)) {
        return secrets[variableName];
      } else {
        console.warn(`Variable ${variableName} not found in secrets`);
        return match; // Return the original string if variable not found
      }
    });
  }

  private async replaceSecretsInObject(
    obj: any,
    secrets: { [key: string]: string }
  ): Promise<void> {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        await this.replaceSecretsInObject(obj[key], secrets); // Recursive call if object
      } else if (typeof obj[key] === "string") {
        obj[key] = await this.replaceSecretsInString(obj[key], secrets);
      }
    }
  }

  private async postProcessConfigForEnv(config: Config): Promise<Config> {
    const secrets = await this.getSecretsKeyValue(); // Assume this method exists and returns a Promise

    if (Object.keys(secrets).length === 0) {
      console.warn(
        "No secrets found in secrets file or no secrets file found!"
      );
      return config;
    }

    await this.replaceSecretsInObject(config, secrets);

    return config;
  }
}
