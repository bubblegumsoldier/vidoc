import { inject, injectable } from "tsyringe";
import { VidocCloudAccessor } from "../../interfaces/VidocCloudAccessor";
import * as vscode from "vscode";
import axios from "axios";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { SavingStrategyVidocCloud } from "../../model/Config";
import { exec } from "child_process";
import { LoginResultRetrieverServer } from "../vscode/vidoc-cloud/LoginResultRetrieverServer";
import { PreferencesManager } from "../../interfaces/PreferencesManager";
import { Prompter } from "../../interfaces/Prompter";
import { SpeechToTextInformation } from "../../model/Vidoc";

const DEFAULT_PORT = 7989;
const DEFAULT_URL = "http://vidoc-cloud.vercel.app/";

type NewUrlResponse = {
    url: string;
};

type SpeechToTextResponse = {
    url: string;
    available: boolean;
};

@injectable()
export class DefaultVidocCloudAccessor implements VidocCloudAccessor {
    constructor(
        @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
        @inject("PreferencesManager")
        private preferencesManager: PreferencesManager,
        @inject("Prompter") private prompter: Prompter
    ) {}

    public async ensureLoggedIn(): Promise<void> {
        if (!(await this.preferencesManager.getCurrentVidocCloudToken())) {
            await this.requestNewToken();
            await this.waitForConfirmation();
            return;
        }
        if (!(await this.currentTokenIsValid())) {
            await this.requestNewToken();
            await this.waitForConfirmation();
            return;
        }
    }

    private async waitForConfirmation(): Promise<void> {
        const answer = await this.prompter.getAnswer(
            "You have been logged in. Do you want to continue recording?",
            ["Yes", "No"],
            "Yes"
        );
        if (answer === "No") {
            throw Error("User aborted login.");
        }
    }

    private async currentTokenIsValid(): Promise<boolean> {
        try {
            await axios.get(
                await this.getApiUrl("/api/projects"),
                await this.getAxiosOptionsWithAuthHeader()
            );
            return true;
        } catch {
            return false;
        }
    }

    private async requestNewToken(): Promise<string | undefined> {
        const token = await this.getNewToken();
        if (!token) {
            throw Error(`Token retrieval failed.`);
        }
        await this.preferencesManager.setCurrentVidocCloudToken(token);
        return token;
    }

    private async getNewToken(): Promise<string | undefined> {
        const loginPath = await this.getApiUrl("extension-auth");
        const command = process.platform === "win32" ? "start" : "open";
        exec(`${command} ${loginPath}`);

        const server = new LoginResultRetrieverServer(DEFAULT_PORT);
        try {
            const token = await server.waitForTokenResponse(120); // 120 seconds timeout
            console.log("Received token:", token);
            return token;
        } catch (error: any) {
            console.error(error.message);
            return undefined;
        }
    }

    public async getAxiosOptionsWithAuthHeader(): Promise<any> {
        const token = await this.preferencesManager.getCurrentVidocCloudToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    private async getApiUrl(suffix: string): Promise<string> {
        const config = await this.configRetriever.getConfig();
        const baseUrl =
            (<SavingStrategyVidocCloud>config.savingStrategy).url ||
            DEFAULT_URL;
        return `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${suffix}`;
    }

    public async requestUploadLink(vidocId: string): Promise<string> {
        await this.ensureLoggedIn();
        const config = await this.configRetriever.getConfig();
        const projectId = (<SavingStrategyVidocCloud>config.savingStrategy)
            .projectId;
        if (!projectId) {
            throw Error(
                "Could not find a project id. Please check your configuration."
            );
        }
        const generateUploadLinkPath = await this.getApiUrl(
            `/api/projects/${projectId}/vidocs/${vidocId}`
        );
        try {
            const options = await this.getAxiosOptionsWithAuthHeader();
            const result: NewUrlResponse = (
                await axios.post(generateUploadLinkPath, {}, { ...options })
            ).data;
            return result.url;
        } catch (e) {
            console.log(e);
            throw Error(
                "Cannot generate link for project. Do you have the correct access rights for the project?"
            );
        }
    }

    public async getVidocTranscript(
        vidocId: string
    ): Promise<SpeechToTextInformation> {
        await this.ensureLoggedIn();
        const config = await this.configRetriever.getConfig();
        const projectId = (<SavingStrategyVidocCloud>config.savingStrategy)
            .projectId;
        if (!projectId) {
            throw Error(
                "Could not find a project id. Please check your configuration."
            );
        }
        const transcriptPath = await this.getApiUrl(
            `/api/projects/${projectId}/vidocs/${vidocId}/transcript`
        );
        try {
            const options = await this.getAxiosOptionsWithAuthHeader();
            const result: SpeechToTextResponse = (
                await axios.get(transcriptPath, { ...options })
            ).data;
            if (result.available) {
                return {
                    text: (await axios.get(result.url)).data,
                    payload: {},
                };
            }
            // Poll for result
            // Fetch every second until result is available
            type FileContent = {
                results: {
                    transcripts: { transcript: string }[];
                    items: any[];
                };
            };

            const result2 = await this.waitForResult<FileContent>(
                result.url,
                1000,
                300000 // 5 minutes timeout
            );
            return {
                text: result2.results.transcripts[0].transcript,
                payload: result2.results.items,
            }
        } catch (e) {
            console.log(e);
            throw Error(
                "Cannot generate transcript for Vidoc. Do you have the correct access rights for the project?"
            );
        }
    }

    private async waitForResult<T>(
        url: string,
        interval: number,
        timeout: number
    ): Promise<T> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                const response = await axios.get(url);
                console.log("Transcript ready");
                if (response.status === 200) {
                    return <T>response.data; // Success, exit the function
                }
            } catch (error) {
                console.log("Transcript not ready, retry");
                // Handle or log error as needed
            }

            // Wait for the specified interval before the next request
            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        throw new Error("Timeout reached without getting status 200");
    }
}
