import { CommandExecutionReference } from "./CommandExecutor";

export interface FFmpegInterface {
  getAudioDevices(): Promise<string[]>;
  getPathToFFmpegBinary(): Promise<string>;
  record(
    window: any,
    audioDevice: string,
    outputFile: string,
    fps: number
  ): Promise<CommandExecutionReference>;
}
