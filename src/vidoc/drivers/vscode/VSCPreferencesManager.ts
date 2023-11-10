import { injectable } from "tsyringe";
import { Notificator } from "../../interfaces/Notificator";
import * as vscode from "vscode";
import { PreferencesManager } from "../../interfaces/PreferencesManager";
const TOKEN_KEY = "vidocCloudToken";

const PREFERRED_AUDIO_INTERFACE_KEY = "preferredAudioInterface";

@injectable()
export class VSCPreferencesManager implements PreferencesManager {
    async setPreferredAudioInterface(
        preferredAudioInterface: string | undefined
    ): Promise<void> {
        const config = vscode.workspace.getConfiguration("vidoc");
        await config.update(
            PREFERRED_AUDIO_INTERFACE_KEY,
            preferredAudioInterface,
            vscode.ConfigurationTarget.Global
        );
    }
    async getPreferredAudioInterface(): Promise<string | undefined> {
        const config = vscode.workspace.getConfiguration("vidoc");
        return await config.get(PREFERRED_AUDIO_INTERFACE_KEY);
    }

    async setCurrentVidocCloudToken(token: string | undefined): Promise<void> {
        const config = vscode.workspace.getConfiguration("vidoc");
        await config.update(
            TOKEN_KEY,
            token,
            vscode.ConfigurationTarget.Global
        );
    }

    async getCurrentVidocCloudToken(): Promise<string | undefined> {
        const config = vscode.workspace.getConfiguration("vidoc");
        return await config.get(TOKEN_KEY);
    }
}
