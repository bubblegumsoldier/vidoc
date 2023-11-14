import { injectable } from "tsyringe";
import { PreferencesManager } from "../../interfaces/PreferencesManager";

export type CommandArgs = { [id: string]: string | undefined };

@injectable()
export class CLIPreferencesManager implements PreferencesManager {
    private args: CommandArgs = {};

    public async getPreferredAudioInterface(): Promise<string | undefined> {
        if (this.args.preferredAudioInterface) {
            return this.args.preferredAudioInterface;
        }
        return undefined;
    }
    
    public async setPreferredAudioInterface(
        preferredAudioInterface: string | undefined
    ): Promise<void> {
        this.args.preferredAudioInterface = preferredAudioInterface;
    }

    public async setCurrentVidocCloudToken(
        token: string | undefined
    ): Promise<void> {
        this.args.token = token;
    }

    public async getCurrentVidocCloudToken(): Promise<string | undefined> {
        if (this.args.token) {
            return this.args.token;
        }
        return undefined;
    }
}
