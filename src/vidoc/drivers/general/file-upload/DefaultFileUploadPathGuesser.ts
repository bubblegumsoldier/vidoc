import { inject, injectable } from "tsyringe";
import { Vidoc } from "../../../model/Vidoc";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { FileUploadPathGuesser } from "../../../interfaces/FileUploadPathGuesser";
import { SavingInformationAWSS3 } from "../../../model/Config";
import { VidocCloudAccessor } from "../../../interfaces/VidocCloudAccessor";

@injectable()
export class DefaultFileUploadPathGuesser implements FileUploadPathGuesser {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("VidocCloudAccessor") private vidocCloudAccessor: VidocCloudAccessor
  ) {}

  async guessPathForFileUpload(vidoc: Vidoc): Promise<string> {
    const config = await this.configRetriever.getConfig();
    if (config.savingStrategy.type === "remote") {
      if (config.savingStrategy.s3) {
        const uploadInformationAWSS3 = <SavingInformationAWSS3>(
          config.savingStrategy.s3
        );
        if (config.savingStrategy.s3.alternativeRootPath) {
          const separator =
            config.savingStrategy.s3.alternativeRootPath.endsWith("/")
              ? ""
              : "/";
          return `${config.savingStrategy.s3.alternativeRootPath}${separator}${vidoc.id}`;
        }
        return `https://${uploadInformationAWSS3.bucketName}.s3.${uploadInformationAWSS3.region}.amazonaws.com/${vidoc.id}`;
      }
    }
    if (config.savingStrategy.type === "vidoc.cloud") {
      return await this.vidocCloudAccessor.requestUploadLink();
    }
    return "";
  }
}
