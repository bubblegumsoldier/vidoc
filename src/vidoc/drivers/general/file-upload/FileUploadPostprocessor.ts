import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../../model/Vidoc";

@injectable()
export class FileUploadPostprocessor implements VideoPostprocessor {
  constructor() {}

  async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
    // File upload 

    return vidoc;
  }
}
