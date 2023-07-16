import { inject, injectable } from "tsyringe";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";
import { v4 as uuidv4 } from "uuid";
import { VidocIdGenerator } from "../../../interfaces/VidocIdGenerator";

@injectable()
export class DefaultVidocIdGenerator implements VidocIdGenerator {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever
  ) {}

  async getNextVidocId(): Promise<string> {
    const id = `${uuidv4()}.${
      (await this.configRetriever.getConfig()).recordingOptions.fileFormat
    }`;
    
    return id;
  }
}
