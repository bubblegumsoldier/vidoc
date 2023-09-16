export declare type AllowedFileFormats = "mp4";

export interface Config {
  savingStrategy: SavingStrategyLocal | SavingStrategyRemote;
  recordingOptions: { fileFormat: AllowedFileFormats };
}

export class SavingStrategyLocal {
  type = "local" as const;
  folder: string = ".vidoc";
}

export class SavingStrategyRemote {
  type = "remote" as const;
  aws?: SavingInformationAWSS3;
  folder: string = ".vidoc";
}

export interface SavingInformationAWSS3 {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  s3ForcePathStyle?: boolean;
}