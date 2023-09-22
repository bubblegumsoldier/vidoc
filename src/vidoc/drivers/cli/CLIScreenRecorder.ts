import { inject, singleton } from "tsyringe";
import { RSScreenRecorder } from "../general/screenRecording/RSScreenRecorder";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { Vidoc } from "../../model/Vidoc";
import { FocusInformation } from "../../model/FocusInformation";

@singleton()
export class CLIScreenRecorder {
  constructor(
    @inject("RSScreenRecorder") private screenRecorder: RSScreenRecorder,
    @inject("VidocFactory") private vidocFactory: VidocFactory
  ) {}

  public run(audioDevice: string, focusInformation?: FocusInformation): Promise<Vidoc> {
    return new Promise(async (resolve, reject) => {
      try {
        const vidoc = await this.vidocFactory.createVidocObject(focusInformation);
        await this.screenRecorder.startRecordingWithAudioDevice(vidoc, audioDevice);

        // Set up the handler for process interruption and termination
        const stopAndResolve = async () => {
          console.log("Stopping recording...");
          await this.screenRecorder.stopRecording();
          console.log("Recording stopped.");
          resolve(vidoc);
        };

        process.on("SIGINT", stopAndResolve); // Catch Ctrl+C
        process.on("SIGTERM", stopAndResolve); // Catch kill

      } catch (error) {
        console.error("Error occurred:", error);
        reject(error);
      }
    });
  }
}
