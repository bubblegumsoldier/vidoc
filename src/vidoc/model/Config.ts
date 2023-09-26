export declare type AllowedFileFormats = "mp4";

export interface Config {
  savingStrategy: SavingStrategyLocal | SavingStrategyRemote;
  recordingOptions: RecordingOptions;
}

export class RecordingOptions {
  fileFormat?: AllowedFileFormats;
  fps?: number;
  postProcessingOptions?: PostprocessingOptions;
}

export class PostprocessingOptions {
  speechToText?: SpeechToTextOptions;
}

export class SpeechToTextOptions {
  enabled = false;
  type = "aws-transcribe" as const;
  awsTranscribe?: AWSTranscribeSpeechToTextOptions;
}

export interface AWSTranscribeSpeechToTextOptions {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export class SavingStrategyLocal {
  type = "local" as const;
  folder: string = ".vidoc";
}

export class SavingStrategyRemote {
  type = "remote" as const;
  s3?: SavingInformationAWSS3;
  s3Administration?: SavingInformationAWSS3;
  folder: string = ".vidoc";
}

export interface SavingInformationAWSS3 {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  s3ForcePathStyle?: boolean;
  alternativeRootPath?: string;
}
