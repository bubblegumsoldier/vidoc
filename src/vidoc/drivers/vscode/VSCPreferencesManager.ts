import { injectable } from "tsyringe";
import { Notificator } from "../../interfaces/Notificator";
import * as vscode from "vscode";
import { PreferencesManager } from "../../interfaces/PreferencesManager";

const PREFERRED_AUDIO_INTERFACE_KEY = "preferredAudioInterface";

@injectable()
export class VSCPreferencesManager implements PreferencesManager {
  async setPreferredAudioInterface(
    preferredAudioInterface: string | undefined
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration("vidoc");
    await config.update(PREFERRED_AUDIO_INTERFACE_KEY, preferredAudioInterface, vscode.ConfigurationTarget.Global);
  }
  async getPreferredAudioInterface(): Promise<string | undefined> {
    const config = vscode.workspace.getConfiguration("vidoc");
    return await config.get(PREFERRED_AUDIO_INTERFACE_KEY);
  }
}
