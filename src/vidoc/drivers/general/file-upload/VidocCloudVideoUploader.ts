import axios from "axios";
import { RemoteVideoUploader } from "../../../interfaces/RemoteVideoUploader";
import { LocalMetaDataRemoteVideoVidoc, Vidoc } from "../../../model/Vidoc";
import { inject, injectable } from "tsyringe";
import { FileController } from "../../../interfaces/FileController";

@injectable()
export class VidocCloudVideoUploader implements RemoteVideoUploader {
  constructor(
    @inject("FileController") private fileController: FileController
  ) {}
  async uploadVideo(vidoc: Vidoc, uploadInformation: any): Promise<string> {
    const parsedVidoc = vidoc as LocalMetaDataRemoteVideoVidoc;

    const videoUrl = parsedVidoc.uploadUrl;
    if (!videoUrl) {
      throw new Error("RemoteVideoUrl is not set in the vidoc.");
    }

    const videoFile = parsedVidoc.tmpVideoFilePath; // Assuming the local video file path is here
    const fileContent = Buffer.from(
      await this.fileController.readFileContentBinary(
        vidoc.tmpVideoFilePath,
        true
      )
    );
    if (!videoFile) {
      throw new Error("LocalVideoFile is not set in the vidoc.");
    }

    try {
      await axios.put(videoUrl, fileContent, {
        headers: {
          "Content-Type": "video/mp4", // Assuming the video is mp4 format
        },
      });
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message);
      }

      throw new Error(
        `Failed to upload video to ${videoUrl}. Reason: ${error.message}`
      );
    }

    return parsedVidoc.remoteVideoUrl;
  }
}
