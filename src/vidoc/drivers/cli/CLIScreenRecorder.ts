import { inject, singleton } from "tsyringe";
import { RSScreenRecorder } from "../general/screenRecording/RSScreenRecorder";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { Vidoc } from "../../model/Vidoc";
import { FocusInformation } from "../../model/FocusInformation";
import { PreferencesManager } from "../../interfaces/PreferencesManager";

@singleton()
export class CLIScreenRecorder {
  constructor(
    @inject("RSScreenRecorder") private screenRecorder: RSScreenRecorder,
    @inject("VidocFactory") private vidocFactory: VidocFactory,
    @inject("PreferencesManager") private preferencesManager: PreferencesManager,
  ) {}

  public run(vidocId: string, audioDevice: string): Promise<Vidoc> {
    return new Promise(async (resolve, reject) => {
      try {
        this.preferencesManager.setPreferredAudioInterface(audioDevice);
        
        const vidoc = await this.vidocFactory.init(vidocId);
        await this.screenRecorder.continueOrStartRecording(vidoc);

        process.stdin.setEncoding('utf8');

        // Set up the handler for process interruption and termination
        const stopAndResolve = async () => {
          console.log("Stopping recording...");
          await this.screenRecorder.stopRecording();
          console.log("Recording stopped.");
          process.stdin.removeAllListeners('readable');
          process.stdin.pause();

          process.off("SIGINT", stopAndResolve);
          process.off("SIGTERM", stopAndResolve);

          resolve(vidoc);
        };

        process.stdin.on('readable', () => {
          let chunk;
          while ((chunk = process.stdin.read()) !== null) {
            if (chunk.trim() === 'exit') {
              stopAndResolve();
            }
          }
        });
        

        process.on("SIGINT", stopAndResolve); // Catch Ctrl+C
        process.on("SIGTERM", stopAndResolve); // Catch kill

      } catch (error) {
        console.error("Error occurred:", error);
        reject(error);
      }
    });
  }
}
