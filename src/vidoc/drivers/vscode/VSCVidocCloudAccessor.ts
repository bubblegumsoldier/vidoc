import { inject, injectable } from "tsyringe";
import { VidocCloudAccessor } from "../../interfaces/VidocCloudAccessor";
import * as vscode from "vscode";
const TOKEN_KEY = "vidocCloudToken";
import axios from "axios";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { SavingStrategyVidocCloud } from "../../model/Config";
import { exec } from "child_process";
import { LoginResultRetrieverServer } from "./vidoc-cloud/LoginResultRetrieverServer";

const DEFAULT_PORT = 7989;
const DEFAULT_URL = "http://vidoc.cloud/api/";

type NewUrlResponse = {
  url: string;
};

@injectable()
export class VSCVidocCloudAccessor implements VidocCloudAccessor {
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever
  ) {}

  async setCurrentToken(token: string | undefined): Promise<void> {
    const config = vscode.workspace.getConfiguration("vidoc");
    await config.update(TOKEN_KEY, token, vscode.ConfigurationTarget.Global);
  }

  async getCurrentToken(): Promise<string | undefined> {
    const config = vscode.workspace.getConfiguration("vidoc");
    return await config.get(TOKEN_KEY);
  }

  public async ensureLoggedIn(): Promise<void> {
    if (!(await this.getCurrentToken())) {
      await this.requestNewToken();
      return;
    }
    if (!(await this.currentTokenIsValid())) {
      await this.requestNewToken();
      return;
    }
  }

  private async currentTokenIsValid(): Promise<boolean> {
    try {
      const response = await axios.get(
        await this.getApiUrl("projects"),
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
    await this.setCurrentToken(token);
    return token;
  }

  private async getNewToken(): Promise<string | undefined> {
    const loginPath = await this.getApiUrl("auth/extension-auth");
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
    const token = await this.getCurrentToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private async getApiUrl(suffix: string): Promise<string> {
    const config = await this.configRetriever.getConfig();
    const baseUrl =
      (<SavingStrategyVidocCloud>config.savingStrategy).url || DEFAULT_URL;
    return `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${suffix}`;
  }

  public async requestUploadLink(vidocId: string): Promise<string> {
    await this.ensureLoggedIn();
    const config = await this.configRetriever.getConfig();
    const projectId = (<SavingStrategyVidocCloud>config.savingStrategy)
      .projectId;
    if(!projectId) {
      throw Error('Could not find a project id. Please check your configuration.');
    }
    const generateUploadLinkPath = await this.getApiUrl(
      `projects/${projectId}/vidoc-links/${vidocId}`
    );
    try {
      const options = await this.getAxiosOptionsWithAuthHeader();
      const result: NewUrlResponse = (
        await axios.post(
          generateUploadLinkPath,
          {},
          {...options}
        )
      ).data;
      return result.url;
    } catch {
      throw Error(
        "Cannot generate link for project. Do you have the correct access rights for the project?"
      );
    }
  }
}
