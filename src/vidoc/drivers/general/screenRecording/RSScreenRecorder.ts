import { inject, singleton } from "tsyringe";
import { ScreenRecorder } from "../../../interfaces/ScreenRecorder";
import { FileController } from "../../../interfaces/FileController";
import { Recorder } from "./screen-recorder";
import * as path from "path";
import { Vidoc } from "../../../model/Vidoc";
import { Prompter } from "../../../interfaces/Prompter";
import { OSUtil } from "./screen-recorder/os";
import { FFmpegUtil } from "./screen-recorder/ffmpeg";
import { Notificator } from "../../../interfaces/Notificator";
import { PreferencesManager } from "../../../interfaces/PreferencesManager";
import { FFmpegInterface } from "../../../interfaces/FFmpegInterface";
import { AudioDeviceSelector } from "../../../interfaces/AudioDeviceSelector";

const STOP_DELAY = 1000; // ms

@singleton()
export class RSScreenRecorder implements ScreenRecorder {
  private currentRecordingVidoc?: Vidoc;
  private finishMethod: any;
  private stopMethod: any;

  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("AudioDeviceSelector") private audioDeviceSelector: AudioDeviceSelector,
    @inject("FFmpegInterface") private ffmpeg: FFmpegInterface,
  ) {}

  public async startRecording(vidoc: Vidoc): Promise<void> {
    const outputFile = this.fileController.getAbsolutePath(
      vidoc.tmpVideoFilePath
    );
    await this.fileController.createDirIfNotExists(path.join(outputFile, ".."));
    try {
      const audioDevice = await this.audioDeviceSelector.getAudioDevice();
      if (!audioDevice) {
        throw Error("Audio device needs to be selected first!");
      }
      console.log({ audioDevice });
      const { finish, stop } = await Recorder.recordActiveWindow({
        file: outputFile,
        fps: 10,
        audio: true,
        audioDevice: audioDevice,
        ffmpeg: {
          binary: await this.ffmpeg.getPathToFFmpegBinary()
        },
      });
      this.finishMethod = finish;
      this.stopMethod = stop;
      this.currentRecordingVidoc = vidoc;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async stopRecording(): Promise<Vidoc> {
    if (!this.finishMethod) {
      throw Error("no finish method");
    }

    // Wait a bit more because ffmpeg tends to cut of the last few frames.
    await new Promise((resolve) => setTimeout(resolve, STOP_DELAY));

    this.stopMethod();
    await this.finishMethod;

    this.finishMethod = undefined;
    this.stopMethod = undefined;

    const output = this.currentRecordingVidoc;
    this.currentRecordingVidoc = undefined;

    return <Vidoc>output;
  }

  public isRecording(): boolean {
    return !!this.currentRecordingVidoc;
  }
}
