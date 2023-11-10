import { inject, injectable } from "tsyringe";
import { VideoPostprocessor } from "../../interfaces/VideoPostprocessor";
import { Vidoc } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";

@injectable()
export class TmpCleanup implements VideoPostprocessor {
    constructor(
        @inject("FileController") private fileController: FileController
    ) {}
    
    public async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
        await this.fileController.cleanupTmp();
        return vidoc;
    }
}
