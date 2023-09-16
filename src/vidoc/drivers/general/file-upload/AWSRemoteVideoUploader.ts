import { inject, injectable } from "tsyringe";
import { RemoteVideoUploader } from "../../../interfaces/RemoteVideoUploader";
import { Vidoc } from "../../../model/Vidoc";
import { S3 } from "aws-sdk";
import { SavingInformationAWSS3 } from "../../../model/Config";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { FileController } from "../../../interfaces/FileController";

@injectable()
export class AWSRemoteVideoUploader implements RemoteVideoUploader {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("FileController") private fileController: FileController,
  ) {}

  async uploadVideo(vidoc: Vidoc, uploadInformation: any): Promise<string> {
    const uploadInformationAWSS3 = <SavingInformationAWSS3>uploadInformation;
    const client = new S3({
      region: uploadInformationAWSS3.region,
    });
    const suffix = (await this.configRetriever.getConfig()).recordingOptions
      .fileFormat;
    const fileName = `${vidoc.id}.${suffix}`;
    const fileContent = this.fileController.readFileContentBinary(vidoc.tmpVideoFilePath, true);

    await client
      .putObject({
        Bucket: uploadInformationAWSS3.bucketName,
        Key: fileName,
        ContentType: suffix,
        Body: fileContent,
        ACL: 'public-read',
      })
      .promise();

      const url = `https://${uploadInformationAWSS3.bucketName}.s3.${uploadInformationAWSS3.region}.amazonaws.com/${fileName}`;
      return url;
  }
}
