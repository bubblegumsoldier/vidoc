import { injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { LocalMetaDataRemoteVideoVidoc, Vidoc } from "../../../model/Vidoc";

@injectable()
export class VidocCloudUploadUrlRemover implements VideoPostprocessor {

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    const correctVidoc = <LocalMetaDataRemoteVideoVidoc>(vidoc);
    if(!correctVidoc.uploadUrl) {
        return vidoc;
    }
    correctVidoc.uploadUrl = "";
    return vidoc;
  }
}
