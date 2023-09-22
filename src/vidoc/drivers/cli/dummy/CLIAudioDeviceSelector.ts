import { injectable } from "tsyringe";
import { AudioDeviceSelector } from "../../../interfaces/AudioDeviceSelector";
@injectable()
export class CLIAudioDeviceSelector implements AudioDeviceSelector {
  constructor() {}
  getAudioDevice(): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }
  forceReselectOfAudioDevice(): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }
}
