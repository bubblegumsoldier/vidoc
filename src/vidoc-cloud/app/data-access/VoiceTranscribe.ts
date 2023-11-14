import TranscribeService, {
    GetTranscriptionJobRequest,
    StartTranscriptionJobRequest,
    TranscriptionJob,
} from "aws-sdk/clients/transcribeservice";
import { S3Accessor, SpeechToTextInformation } from "./S3Accessor";

export class VoiceTranscribe {
    private static getTranscriptFileName(vidocId: string) {
        return vidocId.replace(".", "_") + ".json";
    }

    /**
     * Retrieve transcript of vidoc. We assume it is
     * stored in the same bucket as the video and has the same name
     * but with a .json extension.
     */
    public static async getTranscript(
        projectId: string,
        vidocId: string
    ): Promise<SpeechToTextInformation> {
        const remoteVideoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${projectId}/${vidocId}`;
        const remoteTranscriptUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${
            process.env.S3_REGION
        }.amazonaws.com/${projectId}/${VoiceTranscribe.getTranscriptFileName(
            vidocId
        )}`;

        // Use S3Accessor to check if the video exists
        if (!(await S3Accessor.vidocExists(projectId, vidocId))) {
            throw new Error("Video does not exist");
        }

        // If it already exists, return it
        try {
            const result = await VoiceTranscribe.getTranscribedTextFromUri(
                remoteTranscriptUrl
            );
            return result;
        } catch (error) {
            console.log("No transcript exists yet - will create");
        }

        // otherwise use AWS Transcribe to generate it
        // and then return the generated json file
        const transcribe = new TranscribeService({
            accessKeyId: process.env.AWS_TRANSCRIBE_ACCESS_KEY!,
            secretAccessKey: process.env.AWS_TRANSCRIBE_SECRET_ACCESS_KEY!,
            region: process.env.AWS_TRANSCRIBE_REGION!,
        });

        const jobName = `Transcription_${VoiceTranscribe.getTranscriptFileName(
            vidocId
        )}`;

        const params: StartTranscriptionJobRequest = {
            TranscriptionJobName: jobName,
            LanguageCode: "en-US",
            Media: { MediaFileUri: remoteVideoUrl },
            MediaFormat: "mp4",
            OutputBucketName: process.env.S3_BUCKET_NAME!,
            OutputKey:
                projectId +
                "/" +
                VoiceTranscribe.getTranscriptFileName(vidocId),
        };

        const startJob = await transcribe
            .startTranscriptionJob(params)
            .promise();

        console.log("Job started:", startJob);

        try {
            const completedJob = await VoiceTranscribe.pollForJobCompletion(
                transcribe,
                jobName
            );
            const transcriptFileUri =
                completedJob.Transcript!.TranscriptFileUri;

            return await VoiceTranscribe.getTranscribedTextFromUri(
                transcriptFileUri!
            );
        } catch (error) {
            console.log("An error occurred:", error);
            throw error;
        }
    }

    private static async getTranscribedTextFromUri(
        uri: string
    ): Promise<SpeechToTextInformation> {
        const response = await fetch(uri);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            // Handle HTTP errors (e.g., file not found, server error)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !data.results.transcripts) {
            // Handle the case where the expected data structure is not present
            throw new Error("Invalid response format");
        }

        const transcribedText = data.results.transcripts
            .map((transcript: any) => transcript.transcript)
            .join(" ");

        return { text: transcribedText, payload: data.results };
    }

    private static async pollForJobCompletion(
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
                    } else if (
                        jobDetails?.TranscriptionJobStatus === "FAILED"
                    ) {
                        reject(
                            new Error(
                                `Transcription job failed: ${jobDetails.FailureReason}`
                            )
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
