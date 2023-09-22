import { inject, injectable } from "tsyringe";
import { UnusedVidocRemover } from "../../interfaces/UnusedVidocRemover";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { Notificator } from "../../interfaces/Notificator";
import { VidocRepository } from "../../interfaces/VidocRepository";
import { SavingStrategyRemote } from "../../model/Config";
import { Prompter } from "../../interfaces/Prompter";
import { S3 } from "aws-sdk";

@injectable()
export class DefaultUnusedVidocRemover implements UnusedVidocRemover {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("Notificator") private notificator: Notificator,
    @inject("VidocRepository") private vidocRepository: VidocRepository,
    @inject("Prompter") private prompter: Prompter
  ) {}

  async findUnusedFiles(usedVidocIds: string[]): Promise<string[]> {
    // Get s3 config
    const config = await this.configRetriever.getConfig();
    const awsConfig =
      (<SavingStrategyRemote>config.savingStrategy).s3Administration ||
      (<SavingStrategyRemote>config.savingStrategy).s3;
    if (!awsConfig) {
      throw new Error("No AWS config found");
    }
    const s3 = new S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
      endpoint: awsConfig.endpoint, // Included endpoint and s3ForcePathStyle in S3 configuration
      s3ForcePathStyle: awsConfig.s3ForcePathStyle,
    });

    // The name of your bucket
    const Bucket = awsConfig.bucketName;

    try {
      let allS3Files: string[] = [];

      let ContinuationToken;
      do {
        const response: any = await s3
          .listObjectsV2({ Bucket, ContinuationToken })
          .promise();

        allS3Files = allS3Files.concat(
          response.Contents.map((file: any) => file.Key)
        );
        ContinuationToken = response.NextContinuationToken;
      } while (ContinuationToken);

      const unusedFiles = allS3Files.filter(
        (file) => !usedVidocIds.includes(file)
      );
      return unusedFiles;
    } catch (error) {
      console.error(`Error listing objects from ${Bucket}:`, error);
      throw error;
    }
  }

  async removeFiles(fileNames: string[]): Promise<void> {
    const config = await this.configRetriever.getConfig();
    const awsConfig = (<SavingStrategyRemote>config.savingStrategy).s3Administration || (<SavingStrategyRemote>config.savingStrategy).s3;
    if(!awsConfig) {
        throw new Error('No AWS config found');
    }
    const s3 = new S3({
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
        region: awsConfig.region,
        endpoint: awsConfig.endpoint, // Included endpoint and s3ForcePathStyle in S3 configuration
        s3ForcePathStyle: awsConfig.s3ForcePathStyle,
      });
    
    const Bucket = awsConfig.bucketName;
    
    try {
      await Promise.all(fileNames.map(async fileName => {
        await s3.deleteObject({ Bucket, Key: fileName }).promise();
      }));
      this.notificator.info(`Successfully removed ${fileNames.length} files`);
    } catch (error) {
      console.error('Error deleting files:', error);
      throw error; // Rethrow the error after logging it
    }
  }


  async removeUnusedVidocs(): Promise<void> {
    const config = await this.configRetriever.getConfig();
    if (config.savingStrategy.type !== "remote") {
      this.notificator.warn(
        "Currently we only support removal of remotely saved files"
      );
      return;
    }
    const unusedFiles = await this.findUnusedFiles(
      (await this.vidocRepository.getAllVidocs()).map((vidoc) => vidoc.id)
    );
    if (unusedFiles.length === 0) {
      this.notificator.info("No unused files found");
      return;
    }
    const answer = await this.prompter.getAnswer(
      `We have found ${unusedFiles.length} unused files. Do you want to remove them?`,
      ["Yes", "No", "Show files to be removed"]
    );
    if (answer === "Yes") {
      try { 
        await this.removeFiles(unusedFiles);
      } catch (error) {
        this.notificator.error(`Error removing files: ${error}`);
        return;
      }
    } else if (answer === "Show files to be removed") {
      this.notificator.info(unusedFiles.join("\n"));
    }
  }
}
