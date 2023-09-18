import { inject, injectable } from "tsyringe";
import { FFmpegInterface } from "../../../interfaces/FFmpegInterface";
import { Notificator } from "../../../interfaces/Notificator";
import { FileController } from "../../../interfaces/FileController";
import { FFmpegUtil } from "./screen-recorder/ffmpeg";
import { OSUtil } from "./screen-recorder/os";

@injectable()
export class FFmpegImplementation implements FFmpegInterface {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("Notificator") private notificator: Notificator
  ) {}

  async getAudioDevices(): Promise<string[]> {
    if (process.platform === "win32") {
      return await this.getWinAudioDevices();
    } else if (process.platform === "darwin") {
      return await this.getMacAudioDevices();
    } else {
      throw Error("Unsupported platform Linux");
    }
  }

  async getMacAudioDevices(): Promise<string[]> {
    return await OSUtil.getMacAudioDevices(await this.getPathToFFmpegBinary());
  }

  async getWinAudioDevices(): Promise<string[]> {
    return await OSUtil.getWinAudioDevices(await this.getPathToFFmpegBinary());
  }

  async getPathToFFmpegBinary(): Promise<string> {
    let pathToFFmpegBinary: string | undefined =
      await this.fileController.getBinPath(
        process.platform === "win32" ? "ffmpeg-win32.exe" : "ffmpeg-darwin"
      );
    if (!this.fileController.existsSync(pathToFFmpegBinary)) {
      this.notificator.warn(
        "We didn't find an ffmpeg for your system. We will look on the PATH for it."
      );
      pathToFFmpegBinary = undefined; // it will be looked for on the PATH (this will be necessary for linux)
    }
    console.log({ pathToFFmpegBinary });
    const opts = await FFmpegUtil.findFFmpegBinIfMissing({
      ffmpeg: {
        binary: pathToFFmpegBinary,
      },
    });
    return opts.ffmpeg.binary;
  }
}
