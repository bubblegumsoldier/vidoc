import { inject, singleton } from "tsyringe";
import { ScreenRecorder } from "../../../interfaces/ScreenRecorder";
import { FileController } from "../../../interfaces/FileController";
const { Recorder, GIFCreator } = require('@arcsine/screen-recorder');

@singleton()
export class RSScreenRecorder implements ScreenRecorder {
  private currentRecordingOutput?: string;
  private finishMethod: any;

  constructor(
    @inject('FileController') private fileController: FileController
  ) {}

  public async startRecording(outputFilePath: string): Promise<void> {
    const { finish } = await Recorder.recordActiveWindow({
      file: this.fileController.getAbsolutePath(outputFilePath),
      fps: 10
    });
    this.finishMethod = finish;  
    this.currentRecordingOutput = outputFilePath;
  }

  public async stopRecording(): Promise<string> {
    if(!this.finishMethod) {
      throw Error('no finish method');
    }
    await this.finishMethod();
    this.finishMethod = undefined;
    const output = this.currentRecordingOutput;
    this.currentRecordingOutput = undefined;
    return <string>output;
  }

  public isRecording(): boolean {
    return !!this.currentRecordingOutput;
  }
}
