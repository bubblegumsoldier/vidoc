import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { LocalMetaDataRemoteVideoVidoc, Vidoc } from "../../../model/Vidoc";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { RemoteVideoUploader } from "../../../interfaces/RemoteVideoUploader";
import { AWSRemoteVideoUploader } from "./AWSRemoteVideoUploader";
import { VidocFactory } from "../../../interfaces/VidocFactory";
import { FileUploadPathGuesser } from "../../../interfaces/FileUploadPathGuesser";
import { SavingInformationAWSS3 } from "../../../model/Config";

@injectable()
export class DefaultFileUploadPathGuesser implements FileUploadPathGuesser {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever
  ) {}

  async guessPathForFileUpload(vidoc: Vidoc): Promise<string> {
    const config = await this.configRetriever.getConfig();
    if (config.savingStrategy.type !== "remote") {
      throw Error("This service is only for remote saving strategies!");
    }
    if (config.savingStrategy.s3) {
      const uploadInformationAWSS3 = <SavingInformationAWSS3>(
        config.savingStrategy.s3
      );
      if (config.savingStrategy.s3.alternativeRootPath) {
        const separator = config.savingStrategy.s3.alternativeRootPath.endsWith(
          "/"
        )
          ? ""
          : "/";
        return `${config.savingStrategy.s3.alternativeRootPath}${separator}${vidoc.id}`;
      }
      return `https://${uploadInformationAWSS3.bucketName}.s3.${uploadInformationAWSS3.region}.amazonaws.com/${vidoc.id}`;
    }
    return "";
  }
}
