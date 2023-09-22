import { inject, injectable } from "tsyringe";
import { VidocFactory } from "../../interfaces/VidocFactory";
import {
  LocalMetaDataRemoteVideoVidoc,
  LocalMetadataLocalVideoVidoc,
  Vidoc,
  VidocMetadata,
} from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { FocusInformation } from "../../model/FocusInformation";
import { AuthorInformationRetriever } from "../../interfaces/AuthorInformationRetriever";
import { VidocIdGenerator } from "../../interfaces/VidocIdGenerator";
import { Config } from "../../model/Config";
import { FileUploadPathGuesser } from "../../interfaces/FileUploadPathGuesser";

@injectable()
export class DefaultVidocFactory implements VidocFactory {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("VidocIdGenerator") private vidocIdGenerator: VidocIdGenerator,
    @inject("FileUploadPathGuesser")
    private fileUploadPathGuesser: FileUploadPathGuesser,
    @inject("AuthorInformationRetriever")
    private authorInformationRetriever: AuthorInformationRetriever
  ) {}

  async createVidocObject(focusInformation?: FocusInformation): Promise<Vidoc> {
    // First we will get the config. We will need it later
    const config = await this.configRetriever.getConfig();

    // First time creating vidoc object
    // We will first generate the new vidoc id
    // The id will contain the suffix, so ID = filename
    const vidocId = await this.vidocIdGenerator.getNextVidocId();

    // Then we will create the vidoc metadata object
    const metadata: VidocMetadata = {
      focusInformation: focusInformation,
      createdBy: await this.authorInformationRetriever.getAuthorInformation(),
      createdAt: new Date().toISOString(),
    };

    // Then we will create the vidoc object with default values
    let vidoc: Vidoc = {
      id: vidocId,
      metadata: metadata,
      relativeFilePathMetadata: this.getRelativeFilePathMetadata(
        config,
        vidocId
      ),
      tmpVideoFilePath: await this.fileController.generateTmpFilePath(vidocId),
    };
    if (config.savingStrategy.type === "local") {
      const localVidoc: LocalMetadataLocalVideoVidoc = {
        ...vidoc,
        relativeFilePathToVideo: this.getRelativeFilePathVideo(config, vidocId),
      };
      vidoc = localVidoc;
    } else if (config.savingStrategy.type === "remote") {
      const remoteVidoc: LocalMetaDataRemoteVideoVidoc = {
        ...vidoc,
        remoteVideoUrl: await this.fileUploadPathGuesser.guessPathForFileUpload(
          vidoc
        ), // will be generated in postprocessor
      };
      vidoc = remoteVidoc;
    }

    this.updateVidocMetadataFile(vidoc);

    return vidoc;
  }

  private getRelativeFilePathMetadata(config: Config, id: string): string {
    return `${config.savingStrategy.folder}/${id.split(".")[0]}.json`;
  }

  private getRelativeFilePathVideo(config: Config, id: string): string {
    return `${config.savingStrategy.folder}/${id}`;
  }

  async initVidocObject(id: string): Promise<Vidoc> {
    // First we will get the config. We will need it later
    const config = await this.configRetriever.getConfig();

    // Then we will create the vidoc object with values of the file
    try {
      const vidoc: Vidoc = JSON.parse(
        await this.fileController.readFileContent(
          this.getRelativeFilePathMetadata(config, id),
          true
        )
      );
      return vidoc;
    } catch (e) {
      console.error(e);
      throw Error(`Could not parse vidoc file ${id}`);
    }
  }

  async updateVidocMetadataFile(vidoc: Vidoc): Promise<void> {
    // write full vidoc to file
    await this.fileController.writeFileContent(
      vidoc.relativeFilePathMetadata,
      JSON.stringify(vidoc, null, 4),
      true
    );
  }
}
