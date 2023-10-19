import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { LocalMetaDataRemoteVideoVidoc, Vidoc } from "../../../model/Vidoc";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { RemoteVideoUploader } from "../../../interfaces/RemoteVideoUploader";
import { AWSRemoteVideoUploader } from "./AWSRemoteVideoUploader";
import { VidocFactory } from "../../../interfaces/VidocFactory";
import { VidocCloudVideoUploader } from "./VidocCloudVideoUploader";

@injectable()
export class FileUploadPostprocessor implements VideoPostprocessor {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("AWSRemoteVideoUploader")
    private awsUploader: AWSRemoteVideoUploader,
    @inject("VidocCloudVideoUploader")
    private vidocCloudVideoUploader: VidocCloudVideoUploader,
    @inject("VidocFactory") private vidocFactory: VidocFactory
  ) {}

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    const parsedVidoc = vidoc as LocalMetaDataRemoteVideoVidoc;
    // File upload
    const config = await this.configRetriever.getConfig();
    if (config.savingStrategy.type === "local") {
      throw Error(
        "saving strategy local in file upload postprocessor makes no sense"
      );
    }
    let uploader: RemoteVideoUploader | undefined = undefined;
    let uploadInformation: any = {};
    if (config.savingStrategy.type === "remote") {
      uploader = this.awsUploader;
      uploadInformation = config.savingStrategy.s3;
    }
    if (config.savingStrategy.type === "vidoc.cloud") {
      uploader = this.vidocCloudVideoUploader;
    }
    if (!uploader) {
      throw Error("No uploader found");
    }
    const videoUrl = await uploader.uploadVideo(parsedVidoc, uploadInformation);
    parsedVidoc.remoteVideoUrl = videoUrl;
    await this.vidocFactory.updateVidocMetadataFile(parsedVidoc);
    return vidoc;
  }
}
