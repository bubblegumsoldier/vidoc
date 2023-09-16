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
    @inject("FileController") private fileController: FileController
  ) {}

  async uploadVideo(vidoc: Vidoc, uploadInformation: any): Promise<string> {
    const uploadInformationAWSS3 = <SavingInformationAWSS3>uploadInformation;
    const client = new S3({
      region: uploadInformationAWSS3.region,
      credentials: {
        accessKeyId: uploadInformationAWSS3.accessKeyId,
        secretAccessKey: uploadInformationAWSS3.secretAccessKey,
      },
    });
    const suffix = (await this.configRetriever.getConfig()).recordingOptions
      .fileFormat;
    const fileContent = Buffer.from(
      await this.fileController.readFileContentBinary(
        vidoc.tmpVideoFilePath,
        true
      )
    );

    try {
      await client
        .putObject({
          Bucket: uploadInformationAWSS3.bucketName,
          Key: vidoc.id,
          ContentType: suffix,
          Body: fileContent,
        })
        .promise();

      const url = `https://${uploadInformationAWSS3.bucketName}.s3.${uploadInformationAWSS3.region}.amazonaws.com/${vidoc.id}`;
      return url;
    } finally {
      await this.fileController.deleteFile(vidoc.tmpVideoFilePath, true);
    }
  }
}
