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

@injectable()
export class DefaultVidocFactory implements VidocFactory {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("VidocIdGenerator") private vidocIdGenerator: VidocIdGenerator,
    @inject("AuthorInformationRetriever")
    private authorInformationRetriever: AuthorInformationRetriever
  ) {}

  async createVidocObject(focusInformation: FocusInformation): Promise<Vidoc> {
    const id = await this.vidocIdGenerator.getNextVidocId();
    await this.createMetadataFile(
      await this.getMetadataFilePathAbsoluteForId(id),
      focusInformation
    );
    return this.initVidocObject(id);
  }

  async getMetadataFilePathAbsoluteForId(id: string): Promise<string> {
    const config = await this.configRetriever.getConfig();
    const relativeFilePath = `${config.savingStrategy.folder}/${id}`;
    const absoluteFilePath =
      this.fileController.getAbsolutePath(relativeFilePath);

    const absoluteFilePathMetadata = absoluteFilePath.replace(
      /\.[^.]+$/,
      ".json"
    );
    return absoluteFilePathMetadata;
  }

  private async getLocalVidoc(
    id: string
  ): Promise<LocalMetadataLocalVideoVidoc> {
    const config = await this.configRetriever.getConfig();
    const relativeFilePath = `${config.savingStrategy.folder}/${id}`;
    const absoluteFilePath =
      this.fileController.getAbsolutePath(relativeFilePath);

    const relativeFilePathMetadata = relativeFilePath.replace(
      /\.[^.]+$/,
      ".json"
    );
    const absoluteFilePathMetadata = absoluteFilePath.replace(
      /\.[^.]+$/,
      ".json"
    );

    return <LocalMetadataLocalVideoVidoc>{
      id,
      metadata: await this.parseMetadata(absoluteFilePathMetadata),
      tmpVideoFilePath: await this.getTmpFilePath(id),
      relativeFilePath,
      relativeFilePathMetadata,
      absoluteFilePath,
      absoluteFilePathMetadata,
    };
  }

  private async getTmpFilePath(id: string): Promise<string> {
    return this.fileController.generateTmpFilePath(id);
  }

  private async getRemoteVidoc(id: string): Promise<Vidoc> {
    const config = await this.configRetriever.getConfig();
    const relativeFilePath = `${config.savingStrategy.folder}/${id}`;
    const absoluteFilePath =
      this.fileController.getAbsolutePath(relativeFilePath);
    const relativeFilePathMetadata = relativeFilePath.replace(
      /\.[^.]+$/,
      ".json"
    );
    const absoluteFilePathMetadata = absoluteFilePath.replace(
      /\.[^.]+$/,
      ".json"
    );
    return <LocalMetaDataRemoteVideoVidoc>{
      id,
      metadata: await this.parseMetadata(absoluteFilePathMetadata),
      tmpVideoFilePath: await this.getTmpFilePath(id),
      relativeFilePathMetadata,
      absoluteFilePathMetadata,
      remoteVideoUrl: "", // Not yet known, will be assigned in upload postprocessor
    };
  }

  async initVidocObject(id: string): Promise<Vidoc> {
    const config = await this.configRetriever.getConfig();
    if (config.savingStrategy.type === "local") {
      return this.getLocalVidoc(id);
    } else if (config.savingStrategy.type === "remote") {
      return this.getRemoteVidoc(id);
    }
    throw Error('Unknown type');
  }

  private async parseMetadata(
    absoluteFilePathMetadata: string
  ): Promise<VidocMetadata> {
    try {
      const content = await this.fileController.readFileContent(
        absoluteFilePathMetadata,
        false
      );
      return JSON.parse(content);
    } catch (e) {
      console.error(e);
      throw Error(`Couldnt find metadata at ${absoluteFilePathMetadata}`);
    }
  }

  private async createMetadataFile(
    absoluteFilePathMetadata: string,
    focusInformation: FocusInformation
  ): Promise<VidocMetadata> {
    const metadata = {
      focusInformation,
      createdAt: new Date().toISOString(),
      createdBy: await this.authorInformationRetriever.getAuthorInformation(),
    };
    const s = JSON.stringify(metadata, null, 4);
    await this.fileController.writeFileContent(absoluteFilePathMetadata, s);
    return metadata;
  }


  public async updateVidocMetadataFile(vidoc: Vidoc): Promise<void> {
    // For now all metadata files are local
    const castedVidoc = vidoc as LocalMetadataLocalVideoVidoc|LocalMetaDataRemoteVideoVidoc;
    const metadata = vidoc.metadata;
    const absoluteFilePathMetadata = castedVidoc.absoluteFilePathMetadata;
    const s = JSON.stringify(metadata, null, 4);
    await this.fileController.writeFileContent(absoluteFilePathMetadata, s);
  }
}
