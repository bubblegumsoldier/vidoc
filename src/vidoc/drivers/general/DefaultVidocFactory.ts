import { inject, injectable } from "tsyringe";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { Vidoc, VidocMetadata } from "../../model/Vidoc";
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

  async initVidocObject(id: string): Promise<Vidoc> {
    const config = await this.configRetriever.getConfig();
    if (
      config.savingStrategy.type !== "local" ||
      config.savingStrategy.location !== "central"
    ) {
      throw Error("Only local - central saving strategy supported for now");
    }
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
    // {
    //   focusInformation,
    //   createdAt: (new Date().toISOString()),
    //   createdBy: await this.authorInformationRetriever.getAuthorInformation()
    // }
    return {
      id,
      metadata: await this.parseMetadata(absoluteFilePathMetadata),
      relativeFilePath,
      relativeFilePathMetadata,
      absoluteFilePath,
      absoluteFilePathMetadata,
    };
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
}
