import { inject, injectable } from "tsyringe";
import { Vidoc } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { CommandExecutor } from "../../interfaces/CommandExecutor";
import { FFmpegInterface } from "../../interfaces/FFmpegInterface";
import { VideoPostprocessor } from "../../interfaces/VideoPostprocessor";
import * as fs from "fs";

@injectable()
export class VideoMerger implements VideoPostprocessor {
    constructor(
        @inject("FileController") private fileController: FileController,
        @inject("CommandExecutor") private commandExecutor: CommandExecutor,
        @inject("FFmpegInterface") private ffmpegInterface: FFmpegInterface
    ) {}

    public async postprocessVidoc(vidoc: Vidoc): Promise<Vidoc> {
        const allVideos = vidoc.tmpVideoFilePaths;
        if (allVideos.length === 0) {
            throw Error("No videos to merge");
        }
        if (allVideos.length === 1) {
            vidoc.mergedTmpVideoFilePath = allVideos[0];
            return vidoc;
        }
        const concatFilePath = await this.fileController.generateTmpFilePath(
            vidoc.id.replace(".", "_") + "_concat.txt"
        );
        const outputPath = await this.fileController.generateTmpFilePath(
            vidoc.id
        );

        // Create a file list for concatenation
        const fileContent = allVideos
            .map(
                (file) => `file '${this.fileController.getAbsolutePath(file)}'`
            )
            .join("\n");

        await fs.promises.writeFile(
            this.fileController.getAbsolutePath(concatFilePath),
            fileContent
        );

        const ffmpegCommand = [
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            this.fileController.getAbsolutePath(concatFilePath),
            "-c",
            "copy",
            this.fileController.getAbsolutePath(outputPath),
        ];

        // Execute FFmpeg command
        await this.commandExecutor.processToPromise(
            await this.ffmpegInterface.getPathToFFmpegBinary(),
            ffmpegCommand
        );

        // Update the vidoc object with the new output path
        vidoc.mergedTmpVideoFilePath = outputPath;

        return vidoc;
    }
}
