import { inject, injectable } from "tsyringe";
import { AudioDeviceSelector } from "../../interfaces/AudioDeviceSelector";
import { OSUtil } from "../general/screenRecording/screen-recorder/os";
import { Prompter } from "../../interfaces/Prompter";
import { PreferencesManager } from "../../interfaces/PreferencesManager";
import { FFmpegInterface } from "../../interfaces/FFmpegInterface";

@injectable()
export class VSCAudioDeviceSelector implements AudioDeviceSelector {
  constructor(
    @inject("Prompter") private prompter: Prompter,
    @inject("PreferencesManager") private preferences: PreferencesManager,
    @inject("FFmpegInterface") private ffmpeg: FFmpegInterface
  ) {}

  async forceReselectOfAudioDevice(): Promise<string | undefined> {
    const audioInterfaces = await this.ffmpeg.getAudioDevices();
    if (audioInterfaces.length === 1) {
      await this.preferences.setPreferredAudioInterface(audioInterfaces[0]);
      return audioInterfaces[0];
    }
    let selectedAudioInterface = await this.prompter.getAnswer(
      "Select audio device",
      audioInterfaces
    );
    if (!selectedAudioInterface) {
      return undefined;
    }
    await this.preferences.setPreferredAudioInterface(selectedAudioInterface);
    return selectedAudioInterface;
  }

  async getAudioDevice(): Promise<string | undefined> {
    const audioInterfaces = await this.ffmpeg.getAudioDevices();
    let selectedAudioInterface =
      await this.preferences.getPreferredAudioInterface();
    if (
      !selectedAudioInterface ||
      !audioInterfaces.find(
        (audioInterface) => audioInterface === selectedAudioInterface
      )
    ) {
      return await this.forceReselectOfAudioDevice();
    }
    return selectedAudioInterface;
  }
}
