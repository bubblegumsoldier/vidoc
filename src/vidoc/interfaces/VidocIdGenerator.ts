import { FocusInformation } from "../model/FocusInformation";
import { Vidoc } from "../model/Vidoc";

export interface VidocIdGenerator {
  getNextVidocId(): Promise<string>;
}
