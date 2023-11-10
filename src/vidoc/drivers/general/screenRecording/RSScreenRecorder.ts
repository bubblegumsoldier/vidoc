import { inject, singleton } from "tsyringe";
import { ScreenRecorder } from "../../../interfaces/ScreenRecorder";
import { FileController } from "../../../interfaces/FileController";
import * as path from "path";
import { Vidoc } from "../../../model/Vidoc";
import { FFmpegInterface } from "../../../interfaces/FFmpegInterface";
import { AudioDeviceSelector } from "../../../interfaces/AudioDeviceSelector";
import { WindowSelector } from "../../../interfaces/WindowSelector";
import { ConfigRetriever } from "../../../interfaces/ConfigRetriever";

const STOP_DELAY = 200; // ms

@singleton()
export class RSScreenRecorder implements ScreenRecorder {
  private currentRecordingVidoc?: Vidoc;
  private finishMethod: any;
  private stopMethod: any;
  private lastOutputFile?: string;

  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("FFmpegInterface") private ffmpeg: FFmpegInterface,
    @inject("ConfigRetriever") private config: ConfigRetriever,
    @inject("AudioDeviceSelector")
    private audioDeviceSelector: AudioDeviceSelector,
    @inject("WindowSelector") private windowSelector: WindowSelector
  ) {}

  public async continueOrStartRecording(vidoc: Vidoc): Promise<Vidoc> {
    const audioDevice = await this.audioDeviceSelector.getAudioDevice();
    if (!audioDevice) {
      throw Error("Audio device needs to be selected first!");
    }
    return await this.continueOrStartRecordingWithAudioDevice(vidoc, audioDevice);
  }

  public async continueOrStartRecordingWithAudioDevice(
    vidoc: Vidoc,
    audioDevice: string
  ): Promise<Vidoc> {
    this.lastOutputFile = await this.fileController.generateTmpFilePath(
      vidoc.id
    );
    vidoc.tmpVideoFilePaths.push(this.lastOutputFile);
    // What is this? Delete if not needed at the end
    // await this.fileController.createDirIfNotExists(path.join(outputFile, ".."));
    try {
      const recordingAreaInformation = vidoc.recordingAreaInformation || await this.windowSelector.selectWindow();
      const { finish, kill } = await this.ffmpeg.record(
        recordingAreaInformation,
        audioDevice,
        this.fileController.getAbsolutePath(this.lastOutputFile),
        (await this.config.getConfig()).recordingOptions.fps || 10
      );
      this.finishMethod = finish;
      this.stopMethod = kill;
      this.currentRecordingVidoc = vidoc;
    } catch (e) {
      console.error(e);
      throw e;
    }
    return vidoc;
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
