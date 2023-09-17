import { inject, injectable } from "tsyringe";
import { SpeechToText } from "../../../interfaces/SpeechToText";
import { SpeechToTextInformation, Vidoc } from "../../../model/Vidoc";
import { FileController } from "../../../interfaces/FileController";
import { FFmpegInterface } from "../../../interfaces/FFmpegInterface";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import {
  StartTranscriptionJobRequest,
  TranscriptionJob,
  GetTranscriptionJobRequest,
} from "aws-sdk/clients/transcribeservice";
import TranscribeService = require("aws-sdk/clients/transcribeservice");
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch"; // or another HTTP client to download the file

@injectable()
export class AWSTranscribeSpeechToText implements SpeechToText {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("FFmpegInterface") private ffmpegInterface: FFmpegInterface,
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever
  ) {}

  async convertSpeechToText(vidoc: Vidoc): Promise<SpeechToTextInformation> {
    if (!(<any>vidoc).remoteVideoUrl) {
      throw new Error(
        "Cannot convert speech to text without a remote video url"
      );
    }

    const remoteVideoUrl = (<any>vidoc).remoteVideoUrl;

    const config = await this.configRetriever.getConfig();
    const awsTranscribeConfig =
      config.recordingOptions?.postProcessingOptions?.speechToText
        ?.awsTranscribe;
    if (!awsTranscribeConfig) {
      throw new Error(
        "Cannot convert speech to text without awsTranscribeConfig if aws transcribe is enabled"
      );
    }

    const transcribe = new TranscribeService({
      accessKeyId: awsTranscribeConfig.accessKeyId,
      secretAccessKey: awsTranscribeConfig.secretAccessKey,
      region: awsTranscribeConfig.region,
    });

    const jobName = `Transcription_${uuidv4()}`;

    const params: StartTranscriptionJobRequest = {
      TranscriptionJobName: jobName,
      LanguageCode: "en-US",
      Media: { MediaFileUri: remoteVideoUrl },
      MediaFormat: "mp4",
      OutputBucketName: awsTranscribeConfig.bucketName,
    };

    const startJob = await transcribe.startTranscriptionJob(params).promise();
    console.log("Job started:", startJob);

    try {
      const completedJob = await this.pollForJobCompletion(transcribe, jobName);
      const transcriptFileUri = completedJob.Transcript!.TranscriptFileUri;

      return await this.getTranscribedTextFromUri(
        transcriptFileUri!
      );
    } catch (error) {
      console.log("An error occurred:", error);
      throw error;
    }
  }

  private async getTranscribedTextFromUri(uri: string): Promise<SpeechToTextInformation> {
    const response = await fetch(uri);
    const data = await response.json();

    console.log({results: (<any>data).results});

    // AWS Transcribe's JSON has the transcript under 'results.transcripts'
    const transcribedText = (<any>data).results.transcripts
      .map((transcript: any) => transcript.transcript)
      .join(" ");

    return {text: transcribedText, payload: (<any>data).results};
  }

  private async pollForJobCompletion(
    transcribe: TranscribeService,
    jobName: string
  ): Promise<TranscriptionJob> {
    return new Promise((resolve, reject) => {
      const checkJob = async () => {
        try {
          const params: GetTranscriptionJobRequest = {
            TranscriptionJobName: jobName,
          };
          const { TranscriptionJob: jobDetails } = await transcribe
            .getTranscriptionJob(params)
            .promise();

          if (jobDetails?.TranscriptionJobStatus === "COMPLETED") {
            resolve(jobDetails);
          } else if (jobDetails?.TranscriptionJobStatus === "FAILED") {
            reject(
              new Error(`Transcription job failed: ${jobDetails.FailureReason}`)
            );
          } else {
            setTimeout(checkJob, 5000); // Wait for 5 seconds before trying again
          }
        } catch (error) {
          reject(error);
        }
      };

      checkJob();
    });
  }
}
