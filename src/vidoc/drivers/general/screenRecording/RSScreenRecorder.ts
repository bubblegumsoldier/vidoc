import { inject, singleton } from "tsyringe";
import { ScreenRecorder } from "../../../interfaces/ScreenRecorder";
import { FileController } from "../../../interfaces/FileController";
const { Recorder, GIFCreator } = require('@arcsine/screen-recorder');
import * as path from 'path';
import { Vidoc } from "../../../model/Vidoc";

@singleton()
export class RSScreenRecorder implements ScreenRecorder {
  private currentRecordingVidoc?: Vidoc;
  private finishMethod: any;
  private stopMethod: any;

  constructor(
    @inject('FileController') private fileController: FileController
  ) {}

  public async startRecording(vidoc: Vidoc): Promise<void> {
    const outputFile = vidoc.absoluteFilePath;
    this.fileController.createDirIfNotExists(path.resolve(outputFile, '..'));
    const { finish, stop } = await Recorder.recordActiveWindow({
      file: outputFile,
      fps: 10
    });
    this.finishMethod = finish;  
    this.stopMethod = stop;  
    this.currentRecordingVidoc = vidoc;
  }

  public async stopRecording(): Promise<Vidoc> {
    if(!this.finishMethod) {
      throw Error('no finish method');
    }

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
