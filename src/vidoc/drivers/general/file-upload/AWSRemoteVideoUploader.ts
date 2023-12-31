import { inject, injectable } from "tsyringe";
import { RemoteVideoUploader } from "../../../interfaces/RemoteVideoUploader";
import { Vidoc } from "../../../model/Vidoc";
import { S3 } from "aws-sdk";
import { SavingInformationAWSS3 } from "../../../model/Config";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { FileController } from "../../../interfaces/FileController";
import AWS = require("aws-sdk");
import { FileUploadPathGuesser } from "../../../interfaces/FileUploadPathGuesser";

@injectable()
export class AWSRemoteVideoUploader implements RemoteVideoUploader {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("FileController") private fileController: FileController,
    @inject("FileUploadPathGuesser")
    private fileUploadPathGuesser: FileUploadPathGuesser
  ) {}

  async uploadVideo(vidoc: Vidoc, uploadInformation: any): Promise<string> {
    const uploadInformationAWSS3 = <SavingInformationAWSS3>uploadInformation;

    const s3Options: S3.ClientConfiguration = {
      region: uploadInformationAWSS3.region,
      credentials: {
        accessKeyId: uploadInformationAWSS3.accessKeyId,
        secretAccessKey: uploadInformationAWSS3.secretAccessKey,
      },
    };

    if (uploadInformationAWSS3.endpoint) {
      s3Options.endpoint = new AWS.Endpoint(uploadInformationAWSS3.endpoint);
    }

    if (uploadInformationAWSS3.s3ForcePathStyle !== undefined) {
      s3Options.s3ForcePathStyle = uploadInformationAWSS3.s3ForcePathStyle;
    }

    if(!vidoc.mergedTmpVideoFilePath) {
      throw new Error("Didn't find output video file");
    }

    const client = new S3(s3Options);

    const suffix = (await this.configRetriever.getConfig()).recordingOptions
      .fileFormat;
    const fileContent = Buffer.from(
      await this.fileController.readFileContentBinary(
        vidoc.mergedTmpVideoFilePath,
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

      return this.fileUploadPathGuesser.guessPathForFileUpload(vidoc);
    } finally {
      await this.fileController.deleteFile(vidoc.mergedTmpVideoFilePath, true);
    }
  }
}
