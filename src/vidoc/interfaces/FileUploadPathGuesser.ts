import { Vidoc } from "../model/Vidoc";

export interface FileUploadPathGuesser {
    guessPathForFileUpload(vidoc: Vidoc): Promise<string>;
}
